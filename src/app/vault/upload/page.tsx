"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Upload, Music, ImageIcon, Check, Loader2, X, Copy } from "lucide-react";

interface UploadedFile {
  url: string;
  filename: string;
  size: number;
  type: string;
}

export default function UploadPage() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedAudio, setUploadedAudio] = useState<UploadedFile | null>(null);
  const [uploadedImage, setUploadedImage] = useState<UploadedFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const audioInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File, type: "audio" | "image") => {
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      const response = await fetch("/api/tracks/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Upload failed");
      }

      const data: UploadedFile = await response.json();

      if (type === "audio") {
        setUploadedAudio(data);
        setAudioFile(null);
      } else {
        setUploadedImage(data);
        setImageFile(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/vault"
            className="inline-flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Vault</span>
          </Link>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Upload Music
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-2">
            Upload audio files and album artwork to Vercel Blob storage.
          </p>
        </div>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3"
            >
              <X className="w-5 h-5 text-red-500" />
              <span className="text-red-700 dark:text-red-300">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upload sections */}
        <div className="space-y-6">
          {/* Audio upload */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Music className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h2 className="font-semibold text-zinc-900 dark:text-white">
                  Audio File
                </h2>
                <p className="text-sm text-zinc-500">MP3, WAV, OGG, M4A, AAC</p>
              </div>
            </div>

            <input
              ref={audioInputRef}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
            />

            {!audioFile && !uploadedAudio && (
              <button
                onClick={() => audioInputRef.current?.click()}
                className="w-full py-8 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg hover:border-purple-400 dark:hover:border-purple-600 transition-colors flex flex-col items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400"
              >
                <Upload className="w-8 h-8" />
                <span>Click to select audio file</span>
              </button>
            )}

            {audioFile && !uploadedAudio && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Music className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-white text-sm">
                        {audioFile.name}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {formatSize(audioFile.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setAudioFile(null)}
                    className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded"
                  >
                    <X className="w-4 h-4 text-zinc-500" />
                  </button>
                </div>
                <button
                  onClick={() => handleUpload(audioFile, "audio")}
                  disabled={uploading}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload Audio
                    </>
                  )}
                </button>
              </div>
            )}

            {uploadedAudio && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-300 mb-3">
                  <Check className="w-5 h-5" />
                  <span className="font-medium">Uploaded successfully!</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-xs bg-white dark:bg-zinc-800 p-2 rounded border border-zinc-200 dark:border-zinc-700 overflow-x-auto">
                      {uploadedAudio.url}
                    </code>
                    <button
                      onClick={() => copyToClipboard(uploadedAudio.url, "audio")}
                      className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded"
                    >
                      {copied === "audio" ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-zinc-500" />
                      )}
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      setUploadedAudio(null);
                    }}
                    className="text-sm text-purple-600 hover:text-purple-700"
                  >
                    Upload another
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Image upload */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="font-semibold text-zinc-900 dark:text-white">
                  Album Artwork
                </h2>
                <p className="text-sm text-zinc-500">JPG, PNG, WebP, GIF</p>
              </div>
            </div>

            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />

            {!imageFile && !uploadedImage && (
              <button
                onClick={() => imageInputRef.current?.click()}
                className="w-full py-8 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg hover:border-blue-400 dark:hover:border-blue-600 transition-colors flex flex-col items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <Upload className="w-8 h-8" />
                <span>Click to select image file</span>
              </button>
            )}

            {imageFile && !uploadedImage && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <ImageIcon className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-white text-sm">
                        {imageFile.name}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {formatSize(imageFile.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setImageFile(null)}
                    className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded"
                  >
                    <X className="w-4 h-4 text-zinc-500" />
                  </button>
                </div>
                <button
                  onClick={() => handleUpload(imageFile, "image")}
                  disabled={uploading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload Artwork
                    </>
                  )}
                </button>
              </div>
            )}

            {uploadedImage && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-300 mb-3">
                  <Check className="w-5 h-5" />
                  <span className="font-medium">Uploaded successfully!</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-xs bg-white dark:bg-zinc-800 p-2 rounded border border-zinc-200 dark:border-zinc-700 overflow-x-auto">
                      {uploadedImage.url}
                    </code>
                    <button
                      onClick={() => copyToClipboard(uploadedImage.url, "image")}
                      className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded"
                    >
                      {copied === "image" ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-zinc-500" />
                      )}
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      setUploadedImage(null);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Upload another
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 p-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
          <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
            How to add tracks
          </h3>
          <ol className="text-sm text-amber-700 dark:text-amber-300 space-y-2 list-decimal list-inside">
            <li>Upload your audio file and album artwork above</li>
            <li>Copy the generated URLs</li>
            <li>
              Edit <code className="bg-amber-100 dark:bg-amber-800 px-1 rounded">src/data/tracks.ts</code>
            </li>
            <li>Add a new track object with the URLs and metadata</li>
            <li>Deploy to see your track in the music player</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
