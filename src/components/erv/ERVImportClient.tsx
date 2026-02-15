/**
 * ERV Entity Import Client Component
 *
 * Dedicated interface for importing data directly into the ERV entity system.
 * Supports CSV, JSON, TXT, and MD files with AI-assisted classification.
 */

'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { PageTransition } from '@/components/ios';
import { useDesignTheme } from '@/context/DesignThemeContext';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import {
  ChevronLeft,
  Upload,
  FileText,
  AlertCircle,
  Loader2,
  CheckCircle,
  XCircle,
  Database,
  Users,
  Briefcase,
  Music,
  Calendar,
  Brain,
  ListTodo,
  FileEdit,
  Sparkles,
  Eye,
} from 'lucide-react';

type EntityType = 'Person' | 'Project' | 'Track' | 'Event' | 'Memory' | 'Ticket' | 'Draft' | 'Skill';

interface ImportResult {
  success: boolean;
  dryRun: boolean;
  filename?: string;
  totalItems: number;
  created?: number;
  errors?: number;
  typeCounts: Record<string, number>;
  preview?: Array<{
    index: number;
    entityType: string;
    name: string;
    confidence: number;
    tags: string[];
    contentPreview: string;
  }>;
  results?: Array<{
    index: number;
    entityId?: string;
    entityType: string;
    name: string;
    error?: string;
  }>;
}

const ENTITY_TYPE_ICONS: Record<EntityType, typeof Users> = {
  Person: Users,
  Project: Briefcase,
  Track: Music,
  Event: Calendar,
  Memory: Brain,
  Ticket: ListTodo,
  Draft: FileEdit,
  Skill: Sparkles,
};

const ENTITY_TYPE_COLORS: Record<EntityType, string> = {
  Person: '#3b82f6',
  Project: '#8b5cf6',
  Track: '#ec4899',
  Event: '#f59e0b',
  Memory: '#10b981',
  Ticket: '#6366f1',
  Draft: '#64748b',
  Skill: '#06b6d4',
};

export function ERVImportClient() {
  const { isSignedIn, isLoaded } = useUser();
  const { theme } = useDesignTheme();

  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [defaultType, setDefaultType] = useState<EntityType | ''>('');
  const [commonTags, setCommonTags] = useState('');
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File, dryRun: boolean) => {
    setIsUploading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (defaultType) formData.append('defaultType', defaultType);
      if (commonTags) formData.append('commonTags', commonTags);
      if (dryRun) formData.append('dryRun', 'true');

      const response = await fetch('/api/erv/import', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Import failed');
      } else {
        setResult(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file, true); // Preview first
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file, true); // Preview first
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleConfirmImport = async () => {
    if (!result?.preview) return;
    // Re-upload with dryRun=false
    const input = fileInputRef.current;
    // We need to re-select the file, so prompt user
    fileInputRef.current?.click();
  };

  // Auth check
  if (isLoaded && !isSignedIn) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center p-8">
          <LiquidGlass variant="panel" className="max-w-md p-8 text-center">
            <Database className="w-12 h-12 mx-auto mb-4" style={{ color: 'hsl(var(--theme-primary))' }} />
            <h2 className="text-xl font-semibold mb-2">Sign In Required</h2>
            <p className="text-sm mb-4" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
              ERV entity import is available to authenticated users only.
            </p>
          </LiquidGlass>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div
        className="min-h-screen"
        style={{ backgroundColor: 'hsl(var(--theme-background))' }}
      >
        {/* Header */}
        <header
          className="sticky top-0 z-40 backdrop-blur-xl border-b"
          style={{
            backgroundColor: 'hsl(var(--theme-background) / 0.8)',
            borderColor: 'hsl(var(--theme-border))',
          }}
        >
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="p-2 rounded-xl transition-colors hover:bg-white/10"
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-3">
                <Database className="w-6 h-6" style={{ color: 'hsl(var(--theme-primary))' }} />
                <div>
                  <h1 className="text-lg font-semibold">ERV Import</h1>
                  <p className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                    Import data into entities
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
          {/* Options */}
          <LiquidGlass variant="panel" className="p-6">
            <h3 className="text-sm font-semibold mb-4">Import Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium mb-2 block" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                  Default Entity Type (optional)
                </label>
                <select
                  value={defaultType}
                  onChange={(e) => setDefaultType(e.target.value as EntityType | '')}
                  className="w-full px-3 py-2 rounded-lg text-sm"
                  style={{
                    backgroundColor: 'hsl(var(--theme-muted) / 0.3)',
                    border: '1px solid hsl(var(--theme-border))',
                  }}
                >
                  <option value="">Auto-detect</option>
                  <option value="Person">Person (contacts)</option>
                  <option value="Project">Project</option>
                  <option value="Track">Track (music)</option>
                  <option value="Event">Event</option>
                  <option value="Memory">Memory</option>
                  <option value="Ticket">Ticket (task)</option>
                  <option value="Draft">Draft (writing)</option>
                  <option value="Skill">Skill</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium mb-2 block" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                  Common Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={commonTags}
                  onChange={(e) => setCommonTags(e.target.value)}
                  placeholder="e.g. work, 2026, important"
                  className="w-full px-3 py-2 rounded-lg text-sm"
                  style={{
                    backgroundColor: 'hsl(var(--theme-muted) / 0.3)',
                    border: '1px solid hsl(var(--theme-border))',
                  }}
                />
              </div>
            </div>
          </LiquidGlass>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.md,.json,.csv"
            className="hidden"
            onChange={handleFileSelect}
          />

          {/* Drop Zone */}
          <motion.div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onClick={() => fileInputRef.current?.click()}
            animate={{ scale: isDragging ? 1.02 : 1 }}
            className="border-2 border-dashed rounded-3xl p-12 text-center transition-colors cursor-pointer"
            style={{
              borderColor: isDragging ? 'hsl(var(--theme-primary))' : 'hsl(var(--theme-border))',
              backgroundColor: isDragging ? 'hsl(var(--theme-primary) / 0.1)' : 'transparent',
            }}
          >
            {isUploading ? (
              <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin" style={{ color: 'hsl(var(--theme-primary))' }} />
            ) : (
              <Upload
                className="w-12 h-12 mx-auto mb-4"
                style={{ color: isDragging ? 'hsl(var(--theme-primary))' : 'hsl(var(--theme-muted-foreground))' }}
              />
            )}
            <h3 className="text-lg font-semibold mb-2">
              {isUploading ? 'Processing...' : 'Drop file or click to upload'}
            </h3>
            <p className="text-sm mb-4" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
              AI will classify each item and create ERV entities
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {['.csv', '.json', '.txt', '.md'].map((ext) => (
                <span
                  key={ext}
                  className="px-3 py-1 rounded-full text-xs"
                  style={{ backgroundColor: 'hsl(var(--theme-muted) / 0.5)' }}
                >
                  {ext}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Error */}
          {error && (
            <LiquidGlass variant="panel" className="p-4 border-red-500/30">
              <div className="flex items-center gap-3 text-red-500">
                <XCircle className="w-5 h-5" />
                <span className="text-sm">{error}</span>
              </div>
            </LiquidGlass>
          )}

          {/* Results */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <LiquidGlass variant="panel" className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      {result.dryRun ? (
                        <Eye className="w-6 h-6" style={{ color: 'hsl(var(--theme-primary))' }} />
                      ) : (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      )}
                      <div>
                        <h3 className="font-semibold">
                          {result.dryRun ? 'Preview' : 'Import Complete'}
                        </h3>
                        <p className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                          {result.totalItems} items {result.dryRun ? 'detected' : 'processed'}
                          {result.created !== undefined && `, ${result.created} created`}
                          {result.errors !== undefined && result.errors > 0 && `, ${result.errors} errors`}
                        </p>
                      </div>
                    </div>
                    {result.dryRun && (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        style={{
                          backgroundColor: 'hsl(var(--theme-primary))',
                          color: 'hsl(var(--theme-primary-foreground))',
                        }}
                      >
                        Confirm Import
                      </button>
                    )}
                  </div>

                  {/* Type Distribution */}
                  <div className="mb-6">
                    <h4 className="text-xs font-medium mb-3" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                      Entity Types
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(result.typeCounts).map(([type, count]) => {
                        const Icon = ENTITY_TYPE_ICONS[type as EntityType] || Database;
                        const color = ENTITY_TYPE_COLORS[type as EntityType] || '#888';
                        return (
                          <div
                            key={type}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                            style={{ backgroundColor: `${color}20` }}
                          >
                            <Icon className="w-4 h-4" style={{ color }} />
                            <span className="text-sm font-medium">{type}</span>
                            <span className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                              {count}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Preview Items */}
                  {result.preview && (
                    <div>
                      <h4 className="text-xs font-medium mb-3" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                        Preview (first 20)
                      </h4>
                      <div className="space-y-2 max-h-80 overflow-y-auto">
                        {result.preview.map((item) => {
                          const Icon = ENTITY_TYPE_ICONS[item.entityType as EntityType] || Database;
                          const color = ENTITY_TYPE_COLORS[item.entityType as EntityType] || '#888';
                          return (
                            <div
                              key={item.index}
                              className="flex items-start gap-3 p-3 rounded-lg"
                              style={{ backgroundColor: 'hsl(var(--theme-muted) / 0.3)' }}
                            >
                              <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color }} />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium truncate">{item.name}</span>
                                  <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: `${color}30`, color }}>
                                    {item.entityType}
                                  </span>
                                  <span className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                                    {(item.confidence * 100).toFixed(0)}%
                                  </span>
                                </div>
                                <p className="text-xs truncate mt-1" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                                  {item.contentPreview}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Import Results */}
                  {result.results && (
                    <div>
                      <h4 className="text-xs font-medium mb-3" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                        Created Entities
                      </h4>
                      <div className="space-y-1 max-h-60 overflow-y-auto">
                        {result.results.slice(0, 30).map((item) => (
                          <div
                            key={item.index}
                            className="flex items-center gap-2 text-sm"
                          >
                            {item.error ? (
                              <XCircle className="w-4 h-4 text-red-500" />
                            ) : (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            )}
                            <span className="truncate">{item.name}</span>
                            <span className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                              {item.entityType}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </LiquidGlass>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Help */}
          <LiquidGlass variant="panel" className="p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: 'hsl(var(--theme-primary))' }} />
            <div>
              <h4 className="text-sm font-medium mb-1">File Format Tips</h4>
              <ul className="text-xs space-y-1" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                <li><strong>CSV:</strong> One entity per row. First row can be headers.</li>
                <li><strong>JSON:</strong> Array of items. Each item becomes an entity.</li>
                <li><strong>TXT/MD:</strong> Items separated by blank lines.</li>
                <li>AI will auto-detect entity types based on content keywords.</li>
              </ul>
            </div>
          </LiquidGlass>
        </main>
      </div>
    </PageTransition>
  );
}
