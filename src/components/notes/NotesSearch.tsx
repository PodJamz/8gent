'use client';

import { useRef, useEffect, useCallback } from 'react';
import { Search, X, Command } from 'lucide-react';
import { useNotes } from '@/context/NotesContext';
import { cn } from '@/lib/utils';

interface NotesSearchProps {
  className?: string;
}

export function NotesSearch({ className }: NotesSearchProps) {
  const { searchQuery, setSearchQuery } = useNotes();
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: Cmd/Ctrl + / to focus search (K is reserved for global command palette)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClear = useCallback(() => {
    setSearchQuery('');
    inputRef.current?.focus();
  }, [setSearchQuery]);

  return (
    <div className={cn('relative', className)}>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <Search className="w-4 h-4 text-[hsl(var(--theme-muted-foreground))]" />
      </div>

      <input
        ref={inputRef}
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search notes..."
        className={cn(
          'w-full pl-9 pr-16 py-2 rounded-lg',
          'bg-[hsl(var(--theme-muted))]',
          'border border-transparent',
          'text-sm text-[hsl(var(--theme-foreground))]',
          'placeholder-[hsl(var(--theme-muted-foreground))]',
          'outline-none focus:border-[hsl(var(--theme-primary))]',
          'transition-colors'
        )}
      />

      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
        {searchQuery && (
          <button
            onClick={handleClear}
            className="p-1 rounded hover:bg-[hsl(var(--theme-background))] text-[hsl(var(--theme-muted-foreground))] hover:text-[hsl(var(--theme-foreground))] transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-[hsl(var(--theme-muted-foreground))] bg-[hsl(var(--theme-background))] border border-[hsl(var(--theme-border))] rounded">
          <Command className="w-2.5 h-2.5" />K
        </kbd>
      </div>
    </div>
  );
}
