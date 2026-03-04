'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, FolderInput, ChevronDown } from 'lucide-react';
import { useNotes } from '@/context/NotesContext';
import { cn } from '@/lib/utils';

export function QuickCaptureModal() {
  const { isQuickCaptureOpen, closeQuickCapture, quickCapture, folders } = useNotes();
  const [content, setContent] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>('inbox');
  const [showFolderPicker, setShowFolderPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus textarea when modal opens
  useEffect(() => {
    if (isQuickCaptureOpen && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [isQuickCaptureOpen]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isQuickCaptureOpen) {
      setContent('');
      setSelectedFolderId('inbox');
      setShowFolderPicker(false);
    }
  }, [isQuickCaptureOpen]);

  // Handle escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isQuickCaptureOpen) {
        closeQuickCapture();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isQuickCaptureOpen, closeQuickCapture]);

  const handleSubmit = useCallback(() => {
    if (content.trim()) {
      quickCapture(content, selectedFolderId);
      setContent('');
    }
  }, [content, selectedFolderId, quickCapture]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Cmd/Ctrl + Enter to save
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  const selectedFolder = folders.find((f) => f.id === selectedFolderId);

  return (
    <AnimatePresence>
      {isQuickCaptureOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4"
          onClick={closeQuickCapture}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-2xl border border-[hsl(var(--theme-border))] bg-[hsl(var(--theme-card))] shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[hsl(var(--theme-border))]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[hsl(var(--theme-primary)/0.1)] flex items-center justify-center">
                  <Zap className="w-4 h-4 text-[hsl(var(--theme-primary))]" />
                </div>
                <span
                  className="font-semibold text-[hsl(var(--theme-foreground))]"
                  style={{ fontFamily: 'var(--theme-font-heading)' }}
                >
                  Quick Capture
                </span>
              </div>
              <button
                onClick={closeQuickCapture}
                className="p-1.5 rounded-lg hover:bg-[hsl(var(--theme-muted))] text-[hsl(var(--theme-muted-foreground))] hover:text-[hsl(var(--theme-foreground))] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Capture your thought... (supports markdown)"
                rows={4}
                className={cn(
                  'w-full px-3 py-2.5 rounded-lg resize-none',
                  'bg-[hsl(var(--theme-muted))]',
                  'border border-transparent',
                  'text-sm text-[hsl(var(--theme-foreground))]',
                  'placeholder-[hsl(var(--theme-muted-foreground))]',
                  'outline-none focus:border-[hsl(var(--theme-primary))]',
                  'transition-colors'
                )}
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-[hsl(var(--theme-border))] bg-[hsl(var(--theme-muted)/0.5)]">
              {/* Folder picker */}
              <div className="relative">
                <button
                  onClick={() => setShowFolderPicker(!showFolderPicker)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[hsl(var(--theme-muted))] text-sm text-[hsl(var(--theme-muted-foreground))] transition-colors"
                >
                  <FolderInput className="w-4 h-4" />
                  {selectedFolder ? (
                    <span className="flex items-center gap-1.5">
                      <div
                        className="w-2.5 h-2.5 rounded-sm"
                        style={{ backgroundColor: selectedFolder.color }}
                      />
                      {selectedFolder.name}
                    </span>
                  ) : (
                    'Inbox'
                  )}
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                <AnimatePresence>
                  {showFolderPicker && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute bottom-full left-0 mb-1 w-48 rounded-lg border border-[hsl(var(--theme-border))] bg-[hsl(var(--theme-card))] shadow-lg overflow-hidden z-10"
                    >
                      {folders.map((folder) => (
                        <button
                          key={folder.id}
                          onClick={() => {
                            setSelectedFolderId(folder.id);
                            setShowFolderPicker(false);
                          }}
                          className={cn(
                            'w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors',
                            selectedFolderId === folder.id
                              ? 'bg-[hsl(var(--theme-muted))] text-[hsl(var(--theme-foreground))]'
                              : 'text-[hsl(var(--theme-foreground))] hover:bg-[hsl(var(--theme-muted))]'
                          )}
                        >
                          <div
                            className="w-3 h-3 rounded-sm"
                            style={{ backgroundColor: folder.color }}
                          />
                          {folder.name}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <span className="hidden sm:block text-[10px] text-[hsl(var(--theme-muted-foreground))]">
                  ⌘ + Enter to save
                </span>
                <button
                  onClick={handleSubmit}
                  disabled={!content.trim()}
                  className={cn(
                    'px-4 py-1.5 rounded-lg text-sm font-medium transition-colors',
                    'bg-[hsl(var(--theme-primary))] text-white',
                    'hover:bg-[hsl(var(--theme-primary)/0.9)]',
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                >
                  Save
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
