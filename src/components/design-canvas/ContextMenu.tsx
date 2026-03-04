'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Type,
  StickyNote,
  Image,
  Square,
  Code,
  Video,
  Music,
  Sparkles,
  Smartphone,
  GitBranch,
  Database,
  Copy,
  Scissors,
  Clipboard,
  Trash2,
  Edit3,
  RefreshCw,
  Palette,
  Link,
  Pin,
  Lock,
  ArrowUpToLine,
  ArrowDownToLine,
  Expand,
  ChevronRight,
  ZoomIn,
  Target,
  Settings,
  Layers,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type ContextMenuType = 'canvas' | 'node';

export interface ContextMenuPosition {
  x: number;
  y: number;
  type: ContextMenuType;
  nodeId?: string;
  nodeType?: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  divider?: boolean;
  disabled?: boolean;
  danger?: boolean;
  submenu?: MenuItem[];
  action?: () => void;
}

interface ContextMenuProps {
  position: ContextMenuPosition | null;
  onClose: () => void;
  onAddNode: (type: string, x: number, y: number) => void;
  onCopy: () => void;
  onCut: () => void;
  onPaste: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onEdit: () => void;
  onRegenerate?: () => void;
  onChangeStyle?: () => void;
  onAddConnection?: () => void;
  onAddToContext?: () => void;
  onLock?: () => void;
  onBringToFront?: () => void;
  onSendToBack?: () => void;
  onZoomToFit?: () => void;
  onCenterView?: () => void;
  onSelectAll?: () => void;
  onCanvasSettings?: () => void;
  isLocked?: boolean;
  canRegenerate?: boolean;
}

export function ContextMenu({
  position,
  onClose,
  onAddNode,
  onCopy,
  onCut,
  onPaste,
  onDelete,
  onDuplicate,
  onEdit,
  onRegenerate,
  onChangeStyle,
  onAddConnection,
  onAddToContext,
  onLock,
  onBringToFront,
  onSendToBack,
  onZoomToFit,
  onCenterView,
  onSelectAll,
  onCanvasSettings,
  isLocked = false,
  canRegenerate = false,
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!position) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [position, onClose]);

  if (!position) return null;

  const addNodeItems: MenuItem[] = [
    { id: 'text', label: 'Text', icon: <Type className="w-4 h-4" /> },
    { id: 'sticky', label: 'Sticky Note', icon: <StickyNote className="w-4 h-4" /> },
    { id: 'image', label: 'Image', icon: <Image className="w-4 h-4" /> },
    { id: 'shape', label: 'Shape', icon: <Square className="w-4 h-4" /> },
    { id: 'code', label: 'Code Block', icon: <Code className="w-4 h-4" /> },
    { id: 'divider-1', label: '', divider: true },
    { id: 'video', label: 'Video', icon: <Video className="w-4 h-4" /> },
    { id: 'audio-beat-sync', label: 'Audio / Beat Sync', icon: <Music className="w-4 h-4" /> },
    { id: 'ai_generation', label: 'AI Generator', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'divider-2', label: '', divider: true },
    { id: 'device-frame', label: 'Device Frame', icon: <Smartphone className="w-4 h-4" /> },
    { id: 'flow-process', label: 'Flow Node', icon: <GitBranch className="w-4 h-4" /> },
    { id: 'arch-service', label: 'Architecture Node', icon: <Database className="w-4 h-4" /> },
  ];

  const canvasMenuItems: MenuItem[] = [
    {
      id: 'add-node',
      label: 'Add Node',
      icon: <Layers className="w-4 h-4" />,
      submenu: addNodeItems,
    },
    { id: 'divider-1', label: '', divider: true },
    { id: 'paste', label: 'Paste', icon: <Clipboard className="w-4 h-4" />, shortcut: '⌘V', action: onPaste },
    { id: 'select-all', label: 'Select All', icon: <Square className="w-4 h-4" />, shortcut: '⌘A', action: onSelectAll },
    { id: 'divider-2', label: '', divider: true },
    { id: 'zoom-fit', label: 'Zoom to Fit', icon: <ZoomIn className="w-4 h-4" />, action: onZoomToFit },
    { id: 'center', label: 'Center View', icon: <Target className="w-4 h-4" />, shortcut: '⌘0', action: onCenterView },
    { id: 'divider-3', label: '', divider: true },
    { id: 'settings', label: 'Canvas Settings', icon: <Settings className="w-4 h-4" />, action: onCanvasSettings },
  ];

  const nodeMenuItems: MenuItem[] = [
    { id: 'edit', label: 'Edit', icon: <Edit3 className="w-4 h-4" />, shortcut: 'Enter', action: onEdit },
    ...(canRegenerate
      ? [{ id: 'regenerate', label: 'Regenerate', icon: <RefreshCw className="w-4 h-4" />, action: onRegenerate }]
      : []),
    { id: 'divider-1', label: '', divider: true },
    { id: 'copy', label: 'Copy', icon: <Copy className="w-4 h-4" />, shortcut: '⌘C', action: onCopy },
    { id: 'cut', label: 'Cut', icon: <Scissors className="w-4 h-4" />, shortcut: '⌘X', action: onCut },
    { id: 'duplicate', label: 'Duplicate', icon: <Copy className="w-4 h-4" />, shortcut: '⌘D', action: onDuplicate },
    { id: 'delete', label: 'Delete', icon: <Trash2 className="w-4 h-4" />, shortcut: '⌫', danger: true, action: onDelete },
    { id: 'divider-2', label: '', divider: true },
    { id: 'style', label: 'Change Style', icon: <Palette className="w-4 h-4" />, action: onChangeStyle },
    { id: 'resize', label: 'Resize', icon: <Expand className="w-4 h-4" /> },
    { id: 'connection', label: 'Add Connection', icon: <Link className="w-4 h-4" />, action: onAddConnection },
    { id: 'context', label: 'Add to Context', icon: <Pin className="w-4 h-4" />, action: onAddToContext },
    { id: 'divider-3', label: '', divider: true },
    {
      id: 'lock',
      label: isLocked ? 'Unlock Position' : 'Lock Position',
      icon: <Lock className="w-4 h-4" />,
      action: onLock,
    },
    { id: 'front', label: 'Bring to Front', icon: <ArrowUpToLine className="w-4 h-4" />, shortcut: ']', action: onBringToFront },
    { id: 'back', label: 'Send to Back', icon: <ArrowDownToLine className="w-4 h-4" />, shortcut: '[', action: onSendToBack },
  ];

  const menuItems = position.type === 'canvas' ? canvasMenuItems : nodeMenuItems;

  // Calculate position to keep menu in viewport
  const adjustPosition = (x: number, y: number) => {
    const menuWidth = 220;
    const menuHeight = 400;
    const padding = 8;

    let adjustedX = x;
    let adjustedY = y;

    if (typeof window !== 'undefined') {
      if (x + menuWidth > window.innerWidth - padding) {
        adjustedX = window.innerWidth - menuWidth - padding;
      }
      if (y + menuHeight > window.innerHeight - padding) {
        adjustedY = window.innerHeight - menuHeight - padding;
      }
    }

    return { x: adjustedX, y: adjustedY };
  };

  const { x, y } = adjustPosition(position.x, position.y);

  return (
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, scale: 0.95, y: -5 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.12, ease: 'easeOut' }}
        className="fixed z-[9999] min-w-[200px] py-1.5 rounded-xl bg-background/95 backdrop-blur-xl border border-border shadow-2xl"
        style={{ left: x, top: y }}
      >
        {menuItems.map((item) => {
          if (item.divider) {
            return <div key={item.id} className="my-1.5 h-px bg-border/50" />;
          }

          if (item.submenu) {
            return (
              <SubmenuItem
                key={item.id}
                item={item}
                onSelect={(subItem) => {
                  onAddNode(subItem.id, position.x, position.y);
                  onClose();
                }}
              />
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => {
                item.action?.();
                onClose();
              }}
              disabled={item.disabled}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2 text-sm text-left',
                'hover:bg-accent/50 transition-colors duration-100',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                item.danger && 'text-destructive hover:bg-destructive/10'
              )}
            >
              {item.icon && <span className="text-muted-foreground">{item.icon}</span>}
              <span className="flex-1">{item.label}</span>
              {item.shortcut && (
                <span className="text-xs text-muted-foreground/70">{item.shortcut}</span>
              )}
            </button>
          );
        })}
      </motion.div>
    </AnimatePresence>
  );
}

function SubmenuItem({
  item,
  onSelect,
}: {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
}) {
  return (
    <div className="relative group">
      <button
        className={cn(
          'w-full flex items-center gap-3 px-3 py-2 text-sm text-left',
          'hover:bg-accent/50 transition-colors duration-100'
        )}
      >
        {item.icon && <span className="text-muted-foreground">{item.icon}</span>}
        <span className="flex-1">{item.label}</span>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </button>

      <div className="absolute left-full top-0 ml-1 hidden group-hover:block">
        <motion.div
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          className="min-w-[180px] py-1.5 rounded-xl bg-background/95 backdrop-blur-xl border border-border shadow-2xl"
        >
          {item.submenu?.map((subItem) => {
            if (subItem.divider) {
              return <div key={subItem.id} className="my-1.5 h-px bg-border/50" />;
            }

            return (
              <button
                key={subItem.id}
                onClick={() => onSelect(subItem)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 text-sm text-left',
                  'hover:bg-accent/50 transition-colors duration-100'
                )}
              >
                {subItem.icon && <span className="text-muted-foreground">{subItem.icon}</span>}
                <span className="flex-1">{subItem.label}</span>
              </button>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}

export default ContextMenu;
