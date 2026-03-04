'use client';

import { useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pin, FileText, Clock, Grid, List, SortAsc } from 'lucide-react';
import { useNotes, type Note, type SortOption, type ViewMode } from '@/context/NotesContext';
import { cn } from '@/lib/utils';

interface NotesListProps {
  className?: string;
}

function NoteCard({ note, isSelected }: { note: Note; isSelected: boolean }) {
  const { selectNote, folders } = useNotes();

  const folder = folders.find((f) => f.id === note.folderId);

  const preview = useMemo(() => {
    // Strip markdown and get first ~100 chars
    return note.content
      .replace(/^#+\s+/gm, '')
      .replace(/[*_`~\[\]]/g, '')
      .replace(/\n+/g, ' ')
      .trim()
      .substring(0, 100);
  }, [note.content]);

  const formatDate = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <motion.button
      onClick={() => selectNote(note.id)}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        'w-full text-left p-3 rounded-lg border transition-all',
        isSelected
          ? 'bg-[hsl(var(--theme-primary)/0.1)] border-[hsl(var(--theme-primary))]'
          : 'bg-[hsl(var(--theme-card))] border-[hsl(var(--theme-border))] hover:border-[hsl(var(--theme-primary)/0.5)]'
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-2 mb-1">
        <h3
          className={cn(
            'flex-1 font-medium text-sm truncate',
            isSelected
              ? 'text-[hsl(var(--theme-primary))]'
              : 'text-[hsl(var(--theme-foreground))]'
          )}
          style={{ fontFamily: 'var(--theme-font-heading)' }}
        >
          {note.title || 'Untitled'}
        </h3>
        {note.isPinned && (
          <Pin className="w-3.5 h-3.5 flex-shrink-0 text-[hsl(var(--theme-primary))]" />
        )}
      </div>

      {/* Preview */}
      {preview && (
        <p className="text-xs text-[hsl(var(--theme-muted-foreground))] line-clamp-2 mb-2">
          {preview}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center gap-2 text-[10px] text-[hsl(var(--theme-muted-foreground))]">
        {folder && (
          <>
            <span className="flex items-center gap-1">
              <div
                className="w-2 h-2 rounded-sm"
                style={{ backgroundColor: folder.color }}
              />
              {folder.name}
            </span>
            <span>·</span>
          </>
        )}
        <span className="flex items-center gap-1">
          <Clock className="w-2.5 h-2.5" />
          {formatDate(note.updatedAt)}
        </span>
      </div>
    </motion.button>
  );
}

function NoteRow({ note, isSelected }: { note: Note; isSelected: boolean }) {
  const { selectNote, folders } = useNotes();
  const folder = folders.find((f) => f.id === note.folderId);

  const formatDate = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <motion.button
      onClick={() => selectNote(note.id)}
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className={cn(
        'w-full text-left px-3 py-2.5 flex items-center gap-3 rounded-lg transition-all',
        isSelected
          ? 'bg-[hsl(var(--theme-primary)/0.1)] text-[hsl(var(--theme-primary))]'
          : 'hover:bg-[hsl(var(--theme-muted))] text-[hsl(var(--theme-foreground))]'
      )}
    >
      {note.isPinned ? (
        <Pin className="w-4 h-4 flex-shrink-0 text-[hsl(var(--theme-primary))]" />
      ) : (
        <FileText className="w-4 h-4 flex-shrink-0 text-[hsl(var(--theme-muted-foreground))]" />
      )}

      <span
        className="flex-1 text-sm truncate font-medium"
        style={{ fontFamily: 'var(--theme-font-heading)' }}
      >
        {note.title || 'Untitled'}
      </span>

      {folder && (
        <span className="hidden sm:flex items-center gap-1 text-xs text-[hsl(var(--theme-muted-foreground))]">
          <div
            className="w-2 h-2 rounded-sm"
            style={{ backgroundColor: folder.color }}
          />
        </span>
      )}

      <span className="text-xs text-[hsl(var(--theme-muted-foreground))]">
        {formatDate(note.updatedAt)}
      </span>
    </motion.button>
  );
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'updated', label: 'Last Modified' },
  { value: 'created', label: 'Date Created' },
  { value: 'title', label: 'Title' },
];

export function NotesList({ className }: NotesListProps) {
  const {
    createNote,
    selectedNoteId,
    selectedFolderId,
    selectedFolder,
    getFilteredNotes,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    searchQuery,
  } = useNotes();

  const filteredNotes = getFilteredNotes();

  const handleCreateNote = useCallback(() => {
    createNote(selectedFolderId);
  }, [createNote, selectedFolderId]);

  const folderName = selectedFolder?.name ?? 'All Notes';

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="flex-shrink-0 px-3 py-2 border-b border-[hsl(var(--theme-border))] space-y-2">
        <div className="flex items-center justify-between">
          <h2
            className="text-sm font-semibold text-[hsl(var(--theme-foreground))] truncate"
            style={{ fontFamily: 'var(--theme-font-heading)' }}
          >
            {searchQuery ? `Search: "${searchQuery}"` : folderName}
          </h2>
          <button
            onClick={handleCreateNote}
            className="p-1.5 rounded-lg bg-[hsl(var(--theme-primary))] text-white hover:bg-[hsl(var(--theme-primary)/0.9)] transition-colors"
            title="New note"
            aria-label="Create new note"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Sort and view controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <SortAsc className="w-3.5 h-3.5 text-[hsl(var(--theme-muted-foreground))]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="text-xs bg-transparent border-none outline-none text-[hsl(var(--theme-muted-foreground))] cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-0.5 p-0.5 rounded-md bg-[hsl(var(--theme-muted))]" role="group" aria-label="View mode">
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-1 rounded transition-colors',
                viewMode === 'list'
                  ? 'bg-[hsl(var(--theme-card))] text-[hsl(var(--theme-foreground))]'
                  : 'text-[hsl(var(--theme-muted-foreground))]'
              )}
              aria-label="List view"
              aria-pressed={viewMode === 'list'}
            >
              <List className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-1 rounded transition-colors',
                viewMode === 'grid'
                  ? 'bg-[hsl(var(--theme-card))] text-[hsl(var(--theme-foreground))]'
                  : 'text-[hsl(var(--theme-muted-foreground))]'
              )}
              aria-label="Grid view"
              aria-pressed={viewMode === 'grid'}
            >
              <Grid className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto p-2">
        {filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <FileText className="w-12 h-12 text-[hsl(var(--theme-muted-foreground))] mb-3" />
            <p className="text-sm text-[hsl(var(--theme-muted-foreground))]">
              {searchQuery ? 'No notes found' : 'No notes yet'}
            </p>
            {!searchQuery && (
              <button
                onClick={handleCreateNote}
                className="mt-3 px-3 py-1.5 text-sm rounded-lg bg-[hsl(var(--theme-primary))] text-white hover:bg-[hsl(var(--theme-primary)/0.9)] transition-colors"
              >
                Create your first note
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <motion.div layout className="grid gap-2">
            <AnimatePresence mode="popLayout">
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  isSelected={note.id === selectedNoteId}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div layout className="space-y-0.5">
            <AnimatePresence mode="popLayout">
              {filteredNotes.map((note) => (
                <NoteRow
                  key={note.id}
                  note={note}
                  isSelected={note.id === selectedNoteId}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Footer with count */}
      <div className="flex-shrink-0 px-3 py-1.5 border-t border-[hsl(var(--theme-border))]">
        <p className="text-[10px] text-[hsl(var(--theme-muted-foreground))]">
          {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'}
        </p>
      </div>
    </div>
  );
}
