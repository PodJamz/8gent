'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FileText,
  FileCode,
  Ticket,
  X,
  Layers,
  Eye,
  Code,
  Kanban,
  BookOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// =============================================================================
// Types
// =============================================================================

export type ContextEntityType = 'project' | 'prd' | 'epic' | 'ticket' | 'file';
export type ViewDimension = 'chat' | 'code' | 'kanban' | 'docs';

export interface ContextEntity {
  id: string;
  type: ContextEntityType;
  name: string;
  description?: string;
  status?: string;
  metadata?: Record<string, unknown>;
}

interface ContextBarProps {
  contextChain: ContextEntity[];
  currentView: ViewDimension;
  onViewChange: (view: ViewDimension) => void;
  onEntityClick: (entity: ContextEntity) => void;
  onRemoveEntity: (entityId: string) => void;
  onClearContext: () => void;
  className?: string;
}

// =============================================================================
// Config
// =============================================================================

const ENTITY_CONFIG: Record<ContextEntityType, { icon: typeof Folder; color: string; label: string }> = {
  project: { icon: Folder, color: 'text-blue-400', label: 'Project' },
  prd: { icon: FileText, color: 'text-purple-400', label: 'PRD' },
  epic: { icon: Layers, color: 'text-amber-400', label: 'Epic' },
  ticket: { icon: Ticket, color: 'text-green-400', label: 'Ticket' },
  file: { icon: FileCode, color: 'text-orange-400', label: 'File' },
};

const VIEW_CONFIG: Record<ViewDimension, { icon: typeof Eye; label: string }> = {
  chat: { icon: Eye, label: 'Chat' },
  code: { icon: Code, label: 'Code' },
  kanban: { icon: Kanban, label: 'Kanban' },
  docs: { icon: BookOpen, label: 'Docs' },
};

// =============================================================================
// Entity Chip Component
// =============================================================================

interface EntityChipProps {
  entity: ContextEntity;
  isLast: boolean;
  onClick: () => void;
  onRemove: () => void;
}

function EntityChip({ entity, isLast, onClick, onRemove }: EntityChipProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const config = ENTITY_CONFIG[entity.type];
  const Icon = config.icon;

  return (
    <div className="flex items-center">
      <motion.div
        layout
        className={cn(
          'relative group flex items-center gap-1.5 px-2 py-1 rounded-md',
          'transition-colors cursor-pointer',
          isExpanded ? 'bg-muted' : 'hover:bg-muted/50'
        )}
        onClick={onClick}
      >
        <Icon className={cn('w-3.5 h-3.5', config.color)} />
        <span className="text-sm text-foreground font-medium">
          @{entity.name}
        </span>

        {/* Status badge if present */}
        {entity.status && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground uppercase">
            {entity.status}
          </span>
        )}

        {/* Remove button on hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute -right-1 -top-1 w-4 h-4 rounded-full bg-muted-foreground/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/50"
        >
          <X className="w-2.5 h-2.5 text-muted-foreground" />
        </button>

        {/* Expanded details */}
        <AnimatePresence>
          {isExpanded && entity.description && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="absolute top-full left-0 mt-1 z-50 w-64 p-3 rounded-lg bg-popover border border-border shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className={cn('w-4 h-4', config.color)} />
                <span className="text-xs font-medium text-muted-foreground uppercase">
                  {config.label}
                </span>
              </div>
              <p className="text-sm text-foreground font-medium mb-1">
                {entity.name}
              </p>
              <p className="text-xs text-muted-foreground line-clamp-3">
                {entity.description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Arrow separator */}
      {!isLast && (
        <ChevronRight className="w-4 h-4 text-muted-foreground/50 mx-1 flex-shrink-0" />
      )}
    </div>
  );
}

// =============================================================================
// View Switcher Component
// =============================================================================

interface ViewSwitcherProps {
  currentView: ViewDimension;
  onViewChange: (view: ViewDimension) => void;
}

function ViewSwitcher({ currentView, onViewChange }: ViewSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentConfig = VIEW_CONFIG[currentView];
  const CurrentIcon = currentConfig.icon;

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-md',
          'text-sm font-medium transition-colors',
          'bg-muted/50 hover:bg-muted text-foreground'
        )}
      >
        <CurrentIcon className="w-4 h-4" />
        <span>{currentConfig.label}</span>
        <ChevronDown className={cn(
          'w-3.5 h-3.5 transition-transform',
          isOpen && 'rotate-180'
        )} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute top-full right-0 mt-1 z-50 w-40 rounded-lg bg-popover border border-border shadow-lg overflow-hidden"
          >
            {Object.entries(VIEW_CONFIG).map(([key, config]) => {
              const Icon = config.icon;
              const view = key as ViewDimension;
              return (
                <button
                  key={key}
                  onClick={() => {
                    onViewChange(view);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors',
                    view === currentView
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-muted text-foreground'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{config.label}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export function ContextBar({
  contextChain,
  currentView,
  onViewChange,
  onEntityClick,
  onRemoveEntity,
  onClearContext,
  className,
}: ContextBarProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 px-4 py-2',
        'bg-card/50 border-b border-border backdrop-blur-sm',
        className
      )}
    >
      {/* Context Chain */}
      <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar">
        {contextChain.length === 0 ? (
          <span className="text-sm text-muted-foreground italic">
            No context selected - type @ to add
          </span>
        ) : (
          <>
            {contextChain.map((entity, index) => (
              <EntityChip
                key={entity.id}
                entity={entity}
                isLast={index === contextChain.length - 1}
                onClick={() => onEntityClick(entity)}
                onRemove={() => onRemoveEntity(entity.id)}
              />
            ))}

            {/* Clear all button */}
            {contextChain.length > 1 && (
              <button
                onClick={onClearContext}
                className="ml-2 p-1 rounded hover:bg-muted transition-colors"
                title="Clear all context"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </>
        )}
      </div>

      {/* View Switcher */}
      <ViewSwitcher currentView={currentView} onViewChange={onViewChange} />
    </div>
  );
}

export default ContextBar;
