'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  ChevronDown,
  FileText,
  Folder,
  FolderOpen,
  Search,
  Rocket,
  Cpu,
  Sparkles,
  CheckCircle,
  Map,
  BookOpen,
  Heart,
  Bot,
  Grid3X3,
  Palette,
  Plug,
  X,
} from 'lucide-react';
import { type DocNode } from '@/lib/docs';
import { cn } from '@/lib/utils';

interface DocsSidebarProps {
  tree: DocNode[];
  onSearch?: (query: string) => void;
  className?: string;
}

// Icon mapping
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  'rocket': Rocket,
  'cpu': Cpu,
  'sparkles': Sparkles,
  'check-circle': CheckCircle,
  'map': Map,
  'book-open': BookOpen,
  'heart': Heart,
  'bot': Bot,
  'grid-3x3': Grid3X3,
  'palette': Palette,
  'plug': Plug,
};

export function DocsSidebar({ tree, onSearch, className }: DocsSidebarProps) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['features', 'architecture']));

  // Auto-expand folder containing current page
  useMemo(() => {
    const pathParts = pathname.replace('/wiki/', '').split('/');
    if (pathParts[0]) {
      setExpandedFolders(prev => new Set([...prev, pathParts[0]]));
    }
  }, [pathname]);

  const toggleFolder = (slug: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch?.(e.target.value);
  };

  return (
    <aside
      className={cn(
        "flex flex-col h-full",
        "bg-card/50 backdrop-blur-sm",
        "border-r border-border/50",
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <Link
          href="/wiki"
          className="flex items-center gap-2 group"
        >
          <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <BookOpen className="w-4 h-4 text-primary" />
          </div>
          <span className="font-semibold text-foreground">Documentation</span>
        </Link>
      </div>

      {/* Search */}
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search docs..."
            value={searchQuery}
            onChange={handleSearch}
            className={cn(
              "w-full pl-9 pr-8 py-2 text-sm",
              "bg-muted/50 border border-border/50 rounded-lg",
              "text-foreground placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50",
              "transition-all"
            )}
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                onSearch?.('');
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-muted"
            >
              <X className="w-3 h-3 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tree */}
      <nav className="flex-1 overflow-y-auto px-2 pb-4">
        <ul className="space-y-0.5">
          {tree.map((node) => (
            <NavItem
              key={node.slug}
              node={node}
              depth={0}
              pathname={pathname}
              expandedFolders={expandedFolders}
              onToggleFolder={toggleFolder}
            />
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border/50">
        <p className="text-xs text-muted-foreground text-center">
          Press <kbd className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono text-[10px]">⌘K</kbd> to search
        </p>
      </div>
    </aside>
  );
}

// Individual nav item component
function NavItem({
  node,
  depth,
  pathname,
  expandedFolders,
  onToggleFolder,
}: {
  node: DocNode;
  depth: number;
  pathname: string;
  expandedFolders: Set<string>;
  onToggleFolder: (slug: string) => void;
}) {
  const isExpanded = expandedFolders.has(node.slug);
  const isFolder = node.type === 'folder';
  const href = `/wiki/${node.path}`;
  const isActive = pathname === href || pathname.startsWith(`${href}/`);
  const Icon = node.icon ? ICON_MAP[node.icon] : isFolder ? (isExpanded ? FolderOpen : Folder) : FileText;

  if (isFolder) {
    return (
      <li>
        <button
          onClick={() => onToggleFolder(node.slug)}
          className={cn(
            "w-full flex items-center gap-2 px-2 py-1.5 rounded-lg",
            "text-sm font-medium",
            "hover:bg-muted/50 transition-colors",
            "text-foreground/80 hover:text-foreground",
            isActive && "bg-muted/50 text-foreground"
          )}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
        >
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.15 }}
          >
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
          </motion.div>
          {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
          <span className="truncate">{node.title}</span>
        </button>

        <AnimatePresence initial={false}>
          {isExpanded && node.children && (
            <motion.ul
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              {node.children.map((child) => (
                <NavItem
                  key={child.slug}
                  node={child}
                  depth={depth + 1}
                  pathname={pathname}
                  expandedFolders={expandedFolders}
                  onToggleFolder={onToggleFolder}
                />
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </li>
    );
  }

  // File node
  return (
    <li>
      <Link
        href={href}
        className={cn(
          "flex items-center gap-2 px-2 py-1.5 rounded-lg",
          "text-sm",
          "hover:bg-muted/50 transition-colors",
          isActive
            ? "bg-primary/10 text-primary font-medium"
            : "text-foreground/70 hover:text-foreground"
        )}
        style={{ paddingLeft: `${depth * 12 + 24}px` }}
      >
        <FileText className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="truncate">{node.title}</span>
      </Link>
    </li>
  );
}

export default DocsSidebar;
