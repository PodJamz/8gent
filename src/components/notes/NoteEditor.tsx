'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useHorizontalScroll } from '@/hooks';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import {
  Eye,
  EyeOff,
  Pin,
  PinOff,
  Copy,
  Trash2,
  MoreHorizontal,
  FolderInput,
  Clock,
  Hash,
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Link2,
  Image,
  Heading1,
  Heading2,
  CheckSquare,
} from 'lucide-react';
import { useNotes, type Note } from '@/context/NotesContext';
import { cn } from '@/lib/utils';

interface NoteEditorProps {
  note: Note;
  className?: string;
}

type EditorMode = 'edit' | 'preview' | 'split';

export function NoteEditor({ note, className }: NoteEditorProps) {
  const { updateNote, deleteNote, duplicateNote, togglePinNote, folders, moveNote } = useNotes();
  const [mode, setMode] = useState<EditorMode>('split');
  const [showMenu, setShowMenu] = useState(false);
  const [showMoveMenu, setShowMoveMenu] = useState(false);
  const [localTitle, setLocalTitle] = useState(note.title);
  const [localContent, setLocalContent] = useState(note.content);
  const menuRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const toolbarScrollRef = useHorizontalScroll<HTMLDivElement>();

  // Sync local state when note changes
  useEffect(() => {
    setLocalTitle(note.title);
    setLocalContent(note.content);
  }, [note.id, note.title, note.content]);

  // Debounced save
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (localTitle !== note.title || localContent !== note.content) {
        updateNote(note.id, { title: localTitle, content: localContent });
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [localTitle, localContent, note.id, note.title, note.content, updateNote]);

  // Close menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
        setShowMoveMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalTitle(e.target.value);
  }, []);

  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalContent(e.target.value);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Tab key for indentation
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = e.currentTarget.selectionStart;
        const end = e.currentTarget.selectionEnd;
        const value = e.currentTarget.value;

        if (e.shiftKey) {
          // Remove indentation
          const beforeCursor = value.substring(0, start);
          const afterCursor = value.substring(end);
          const lastNewline = beforeCursor.lastIndexOf('\n') + 1;
          const lineStart = beforeCursor.substring(lastNewline);

          if (lineStart.startsWith('  ')) {
            setLocalContent(
              value.substring(0, lastNewline) + lineStart.substring(2) + afterCursor
            );
          }
        } else {
          // Add indentation
          setLocalContent(value.substring(0, start) + '  ' + value.substring(end));
          setTimeout(() => {
            if (contentRef.current) {
              contentRef.current.selectionStart = contentRef.current.selectionEnd = start + 2;
            }
          }, 0);
        }
      }

      // Cmd/Ctrl + B for bold
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        wrapSelection('**', '**');
      }

      // Cmd/Ctrl + I for italic
      if ((e.metaKey || e.ctrlKey) && e.key === 'i') {
        e.preventDefault();
        wrapSelection('*', '*');
      }

      // Cmd/Ctrl + Shift + K for link (K alone is reserved for global command palette)
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'k') {
        e.preventDefault();
        wrapSelection('[', '](url)');
      }
    },
    []
  );

  const wrapSelection = useCallback((before: string, after: string) => {
    if (!contentRef.current) return;

    const start = contentRef.current.selectionStart;
    const end = contentRef.current.selectionEnd;
    const text = localContent;
    const selected = text.substring(start, end) || 'text';

    const newText = text.substring(0, start) + before + selected + after + text.substring(end);
    setLocalContent(newText);

    setTimeout(() => {
      if (contentRef.current) {
        contentRef.current.focus();
        contentRef.current.selectionStart = start + before.length;
        contentRef.current.selectionEnd = start + before.length + selected.length;
      }
    }, 0);
  }, [localContent]);

  const insertAtLineStart = useCallback((prefix: string) => {
    if (!contentRef.current) return;

    const start = contentRef.current.selectionStart;
    const text = localContent;

    // Find the start of the current line
    const lineStart = text.lastIndexOf('\n', start - 1) + 1;
    const lineEnd = text.indexOf('\n', start);
    const endPos = lineEnd === -1 ? text.length : lineEnd;

    const newText = text.substring(0, lineStart) + prefix + text.substring(lineStart);
    setLocalContent(newText);

    setTimeout(() => {
      if (contentRef.current) {
        contentRef.current.focus();
        contentRef.current.selectionStart = contentRef.current.selectionEnd = start + prefix.length;
      }
    }, 0);
  }, [localContent]);

  const insertCodeBlock = useCallback(() => {
    if (!contentRef.current) return;

    const start = contentRef.current.selectionStart;
    const end = contentRef.current.selectionEnd;
    const text = localContent;
    const selected = text.substring(start, end) || 'code here';

    const newText = text.substring(0, start) + '\n```\n' + selected + '\n```\n' + text.substring(end);
    setLocalContent(newText);

    setTimeout(() => {
      if (contentRef.current) {
        contentRef.current.focus();
        contentRef.current.selectionStart = start + 5;
        contentRef.current.selectionEnd = start + 5 + selected.length;
      }
    }, 0);
  }, [localContent]);

  const insertImage = useCallback(() => {
    if (!contentRef.current) return;

    const start = contentRef.current.selectionStart;
    const text = localContent;

    const imageMarkdown = '![alt text](image-url)';
    const newText = text.substring(0, start) + imageMarkdown + text.substring(start);
    setLocalContent(newText);

    setTimeout(() => {
      if (contentRef.current) {
        contentRef.current.focus();
        contentRef.current.selectionStart = start + 2;
        contentRef.current.selectionEnd = start + 10;
      }
    }, 0);
  }, [localContent]);

  const handleDuplicate = useCallback(() => {
    duplicateNote(note.id);
    setShowMenu(false);
  }, [duplicateNote, note.id]);

  const handleDelete = useCallback(() => {
    if (confirm('Delete this note? This cannot be undone.')) {
      deleteNote(note.id);
    }
    setShowMenu(false);
  }, [deleteNote, note.id]);

  const handleMove = useCallback(
    (folderId: string | null) => {
      moveNote(note.id, folderId);
      setShowMenu(false);
      setShowMoveMenu(false);
    },
    [moveNote, note.id]
  );

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const currentFolder = folders.find((f) => f.id === note.folderId);

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="flex-shrink-0 border-b border-[hsl(var(--theme-border))] p-3 space-y-2">
        {/* Title and actions */}
        <div className="flex items-center gap-2">
          <input
            ref={titleRef}
            value={localTitle}
            onChange={handleTitleChange}
            placeholder="Untitled"
            className={cn(
              'flex-1 text-lg font-semibold bg-transparent border-none outline-none',
              'text-[hsl(var(--theme-foreground))]',
              'placeholder-[hsl(var(--theme-muted-foreground))]'
            )}
            style={{ fontFamily: 'var(--theme-font-heading)' }}
          />

          {/* View mode toggle */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-[hsl(var(--theme-muted))]">
            <button
              onClick={() => setMode('edit')}
              className={cn(
                'p-1.5 rounded transition-colors',
                mode === 'edit'
                  ? 'bg-[hsl(var(--theme-card))] text-[hsl(var(--theme-foreground))]'
                  : 'text-[hsl(var(--theme-muted-foreground))] hover:text-[hsl(var(--theme-foreground))]'
              )}
              title="Edit mode"
              aria-label="Switch to edit mode"
              aria-pressed={mode === 'edit'}
            >
              <EyeOff className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              onClick={() => setMode('split')}
              className={cn(
                'p-1.5 rounded transition-colors',
                mode === 'split'
                  ? 'bg-[hsl(var(--theme-card))] text-[hsl(var(--theme-foreground))]'
                  : 'text-[hsl(var(--theme-muted-foreground))] hover:text-[hsl(var(--theme-foreground))]'
              )}
              title="Split view"
              aria-label="Switch to split view"
              aria-pressed={mode === 'split'}
            >
              <div className="w-4 h-4 flex gap-0.5" aria-hidden="true">
                <div className="w-1.5 h-full bg-current rounded-sm" />
                <div className="w-1.5 h-full bg-current rounded-sm opacity-50" />
              </div>
            </button>
            <button
              onClick={() => setMode('preview')}
              className={cn(
                'p-1.5 rounded transition-colors',
                mode === 'preview'
                  ? 'bg-[hsl(var(--theme-card))] text-[hsl(var(--theme-foreground))]'
                  : 'text-[hsl(var(--theme-muted-foreground))] hover:text-[hsl(var(--theme-foreground))]'
              )}
              title="Preview mode"
              aria-label="Switch to preview mode"
              aria-pressed={mode === 'preview'}
            >
              <Eye className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          {/* Pin button */}
          <button
            onClick={() => togglePinNote(note.id)}
            className={cn(
              'p-2 rounded-lg transition-colors',
              note.isPinned
                ? 'text-[hsl(var(--theme-primary))] bg-[hsl(var(--theme-primary)/0.1)]'
                : 'text-[hsl(var(--theme-muted-foreground))] hover:text-[hsl(var(--theme-foreground))] hover:bg-[hsl(var(--theme-muted))]'
            )}
            title={note.isPinned ? 'Unpin' : 'Pin'}
            aria-label={note.isPinned ? 'Unpin note' : 'Pin note'}
            aria-pressed={note.isPinned}
          >
            {note.isPinned ? <Pin className="w-4 h-4" aria-hidden="true" /> : <PinOff className="w-4 h-4" aria-hidden="true" />}
          </button>

          {/* More menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-lg text-[hsl(var(--theme-muted-foreground))] hover:text-[hsl(var(--theme-foreground))] hover:bg-[hsl(var(--theme-muted))] transition-colors"
              aria-label="More options"
              aria-haspopup="true"
              aria-expanded={showMenu}
            >
              <MoreHorizontal className="w-4 h-4" aria-hidden="true" />
            </button>

            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -5 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-1 z-50 w-48 rounded-lg border border-[hsl(var(--theme-border))] bg-[hsl(var(--theme-card))] shadow-lg overflow-hidden"
                >
                  <button
                    onClick={handleDuplicate}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[hsl(var(--theme-foreground))] hover:bg-[hsl(var(--theme-muted))] transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    Duplicate
                  </button>

                  <div className="relative">
                    <button
                      onClick={() => setShowMoveMenu(!showMoveMenu)}
                      className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm text-[hsl(var(--theme-foreground))] hover:bg-[hsl(var(--theme-muted))] transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <FolderInput className="w-4 h-4" />
                        Move to...
                      </span>
                      <span className="text-[hsl(var(--theme-muted-foreground))]">&gt;</span>
                    </button>

                    <AnimatePresence>
                      {showMoveMenu && (
                        <motion.div
                          initial={{ opacity: 0, x: 5 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 5 }}
                          className="absolute left-full top-0 ml-1 w-40 rounded-lg border border-[hsl(var(--theme-border))] bg-[hsl(var(--theme-card))] shadow-lg overflow-hidden"
                        >
                          <button
                            onClick={() => handleMove(null)}
                            className={cn(
                              'w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors',
                              note.folderId === null
                                ? 'bg-[hsl(var(--theme-muted))] text-[hsl(var(--theme-foreground))]'
                                : 'text-[hsl(var(--theme-foreground))] hover:bg-[hsl(var(--theme-muted))]'
                            )}
                          >
                            All Notes
                          </button>
                          {folders.map((folder) => (
                            <button
                              key={folder.id}
                              onClick={() => handleMove(folder.id)}
                              className={cn(
                                'w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors',
                                note.folderId === folder.id
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

                  <div className="h-px bg-[hsl(var(--theme-border))]" />

                  <button
                    onClick={handleDelete}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Metadata row */}
        <div className="flex items-center gap-3 text-xs text-[hsl(var(--theme-muted-foreground))]">
          {currentFolder && (
            <span className="flex items-center gap-1">
              <div
                className="w-2 h-2 rounded-sm"
                style={{ backgroundColor: currentFolder.color }}
              />
              {currentFolder.name}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDate(note.updatedAt)}
          </span>
          {note.tags.length > 0 && (
            <span className="flex items-center gap-1">
              <Hash className="w-3 h-3" />
              {note.tags.join(', ')}
            </span>
          )}
        </div>
      </div>

      {/* Formatting toolbar */}
      {(mode === 'edit' || mode === 'split') && (
        <div
          ref={toolbarScrollRef}
          className="flex-shrink-0 flex items-center gap-1 px-3 py-2 border-b border-[hsl(var(--theme-border))] bg-[hsl(var(--theme-muted)/0.3)] overflow-x-auto scrollbar-hide"
        >
          <button
            onClick={() => wrapSelection('**', '**')}
            className="p-1.5 rounded hover:bg-[hsl(var(--theme-muted))] text-[hsl(var(--theme-muted-foreground))] hover:text-[hsl(var(--theme-foreground))] transition-colors"
            title="Bold (Cmd+B)"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => wrapSelection('*', '*')}
            className="p-1.5 rounded hover:bg-[hsl(var(--theme-muted))] text-[hsl(var(--theme-muted-foreground))] hover:text-[hsl(var(--theme-foreground))] transition-colors"
            title="Italic (Cmd+I)"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => wrapSelection('~~', '~~')}
            className="p-1.5 rounded hover:bg-[hsl(var(--theme-muted))] text-[hsl(var(--theme-muted-foreground))] hover:text-[hsl(var(--theme-foreground))] transition-colors"
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-[hsl(var(--theme-border))] mx-1" />

          <button
            onClick={() => insertAtLineStart('# ')}
            className="p-1.5 rounded hover:bg-[hsl(var(--theme-muted))] text-[hsl(var(--theme-muted-foreground))] hover:text-[hsl(var(--theme-foreground))] transition-colors"
            title="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertAtLineStart('## ')}
            className="p-1.5 rounded hover:bg-[hsl(var(--theme-muted))] text-[hsl(var(--theme-muted-foreground))] hover:text-[hsl(var(--theme-foreground))] transition-colors"
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-[hsl(var(--theme-border))] mx-1" />

          <button
            onClick={() => insertAtLineStart('- ')}
            className="p-1.5 rounded hover:bg-[hsl(var(--theme-muted))] text-[hsl(var(--theme-muted-foreground))] hover:text-[hsl(var(--theme-foreground))] transition-colors"
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertAtLineStart('1. ')}
            className="p-1.5 rounded hover:bg-[hsl(var(--theme-muted))] text-[hsl(var(--theme-muted-foreground))] hover:text-[hsl(var(--theme-foreground))] transition-colors"
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertAtLineStart('- [ ] ')}
            className="p-1.5 rounded hover:bg-[hsl(var(--theme-muted))] text-[hsl(var(--theme-muted-foreground))] hover:text-[hsl(var(--theme-foreground))] transition-colors"
            title="Task List"
          >
            <CheckSquare className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertAtLineStart('> ')}
            className="p-1.5 rounded hover:bg-[hsl(var(--theme-muted))] text-[hsl(var(--theme-muted-foreground))] hover:text-[hsl(var(--theme-foreground))] transition-colors"
            title="Quote"
          >
            <Quote className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-[hsl(var(--theme-border))] mx-1" />

          <button
            onClick={() => wrapSelection('`', '`')}
            className="p-1.5 rounded hover:bg-[hsl(var(--theme-muted))] text-[hsl(var(--theme-muted-foreground))] hover:text-[hsl(var(--theme-foreground))] transition-colors"
            title="Inline Code"
          >
            <Code className="w-4 h-4" />
          </button>
          <button
            onClick={insertCodeBlock}
            className="p-1.5 rounded hover:bg-[hsl(var(--theme-muted))] text-[hsl(var(--theme-muted-foreground))] hover:text-[hsl(var(--theme-foreground))] transition-colors text-xs font-mono"
            title="Code Block"
          >
            {'</>'}
          </button>

          <div className="w-px h-5 bg-[hsl(var(--theme-border))] mx-1" />

          <button
            onClick={() => wrapSelection('[', '](url)')}
            className="p-1.5 rounded hover:bg-[hsl(var(--theme-muted))] text-[hsl(var(--theme-muted-foreground))] hover:text-[hsl(var(--theme-foreground))] transition-colors"
            title="Link (Cmd+K)"
          >
            <Link2 className="w-4 h-4" />
          </button>
          <button
            onClick={insertImage}
            className="p-1.5 rounded hover:bg-[hsl(var(--theme-muted))] text-[hsl(var(--theme-muted-foreground))] hover:text-[hsl(var(--theme-foreground))] transition-colors"
            title="Image"
          >
            <Image className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Editor area */}
      <div className="flex-1 flex min-h-0">
        {/* Edit pane */}
        <AnimatePresence mode="wait">
          {(mode === 'edit' || mode === 'split') && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={cn(
                'flex-1 min-w-0 flex flex-col',
                mode === 'split' && 'border-r border-[hsl(var(--theme-border))]'
              )}
            >
              <textarea
                ref={contentRef}
                value={localContent}
                onChange={handleContentChange}
                onKeyDown={handleKeyDown}
                placeholder="Start writing with markdown..."
                className={cn(
                  'w-full h-full p-4 bg-transparent border-none outline-none resize-none',
                  'text-[hsl(var(--theme-foreground))]',
                  'placeholder-[hsl(var(--theme-muted-foreground))]',
                  'font-mono text-sm leading-relaxed'
                )}
                spellCheck={false}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Preview pane */}
        <AnimatePresence mode="wait">
          {(mode === 'preview' || mode === 'split') && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 min-w-0 overflow-auto"
            >
              <div className="p-4 prose prose-sm dark:prose-invert max-w-none prose-headings:font-[var(--theme-font-heading)] prose-headings:text-[hsl(var(--theme-foreground))] prose-p:text-[hsl(var(--theme-foreground))] prose-a:text-[hsl(var(--theme-primary))] prose-code:text-[hsl(var(--theme-primary))] prose-code:bg-[hsl(var(--theme-muted))] prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-[hsl(var(--theme-muted))] prose-pre:border prose-pre:border-[hsl(var(--theme-border))]">
                {localContent ? (
                  <ReactMarkdown>{localContent}</ReactMarkdown>
                ) : (
                  <p className="text-[hsl(var(--theme-muted-foreground))] italic">
                    Nothing to preview yet...
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
