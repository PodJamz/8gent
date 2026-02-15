'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wrench,
  Search,
  Calendar,
  Palette,
  CloudSun,
  FolderKanban,
  Image as ImageIcon,
  Boxes,
  Brain,
  MessageSquare,
  Code,
  GitBranch,
  Package,
  HeartPulse,
  X,
  Check,
  Sparkles,
} from 'lucide-react';
import { getTPMJSClient, type TPMJSTool } from '@/lib/tpmjs/client';

// ============================================================================
// Types
// ============================================================================

export type ToolProvider = 'legacy' | 'tpmjs';

export interface SelectedTool {
  name: string;
  provider: ToolProvider;
}

interface ToolProviderSelectorProps {
  selectedTools: SelectedTool[];
  onToolsChange: (tools: SelectedTool[]) => void;
  className?: string;
}

// ============================================================================
// Legacy Tool Groups (curated from CLAW_AI_TOOLS)
// ============================================================================

interface ToolGroup {
  label: string;
  icon: typeof Search;
  tools: { name: string; label: string; description: string }[];
}

const LEGACY_TOOL_GROUPS: ToolGroup[] = [
  {
    label: 'Portfolio',
    icon: Search,
    tools: [
      { name: 'search_portfolio', label: 'Search Portfolio', description: 'Search projects, skills, and experience' },
      { name: 'navigate_to', label: 'Navigate', description: 'Route to any page in OpenClaw-OS' },
      { name: 'list_themes', label: 'List Themes', description: 'Browse 50+ design themes' },
      { name: 'open_search_app', label: 'Open Search', description: 'Full-text search interface' },
    ],
  },
  {
    label: 'Scheduling',
    icon: Calendar,
    tools: [
      { name: 'schedule_call', label: 'Schedule Call', description: 'Open Calendly with topic' },
      { name: 'get_available_times', label: 'Available Times', description: 'Query open calendar slots' },
      { name: 'book_meeting', label: 'Book Meeting', description: 'Create a meeting' },
    ],
  },
  {
    label: 'Rich UI',
    icon: Boxes,
    tools: [
      { name: 'render_ui', label: 'Render UI', description: 'Generate custom interface trees' },
      { name: 'show_weather', label: 'Weather', description: 'Live weather widget' },
      { name: 'show_kanban_tasks', label: 'Kanban', description: 'Task board view' },
      { name: 'show_photos', label: 'Photos', description: 'Photo gallery display' },
    ],
  },
  {
    label: 'Memory',
    icon: Brain,
    tools: [
      { name: 'remember', label: 'Remember', description: 'Search episodic memories' },
      { name: 'recall_preference', label: 'Recall', description: 'Query semantic memory' },
      { name: 'memorize', label: 'Memorize', description: 'Store new memories' },
      { name: 'learn', label: 'Learn', description: 'Create semantic knowledge' },
    ],
  },
  {
    label: 'Product',
    icon: FolderKanban,
    tools: [
      { name: 'create_project', label: 'Create Project', description: 'Start a product initiative' },
      { name: 'create_prd', label: 'Create PRD', description: 'Product requirements document' },
      { name: 'create_ticket', label: 'Create Ticket', description: 'BMAD user story' },
      { name: 'update_ticket', label: 'Update Ticket', description: 'Modify ticket status' },
    ],
  },
  {
    label: 'Code',
    icon: Code,
    tools: [
      { name: 'read_file', label: 'Read File', description: 'Read file contents' },
      { name: 'write_file', label: 'Write File', description: 'Create or update files' },
      { name: 'run_command', label: 'Run Command', description: 'Execute shell commands' },
      { name: 'search_codebase', label: 'Search Code', description: 'Full codebase search' },
    ],
  },
  {
    label: 'Git',
    icon: GitBranch,
    tools: [
      { name: 'git_status', label: 'Git Status', description: 'Current repo state' },
      { name: 'git_diff', label: 'Git Diff', description: 'View file changes' },
      { name: 'git_commit', label: 'Git Commit', description: 'Commit staged changes' },
      { name: 'create_branch', label: 'Create Branch', description: 'New git branch' },
    ],
  },
  {
    label: 'Channels',
    icon: MessageSquare,
    tools: [
      { name: 'send_channel_message', label: 'Send Message', description: 'Send via channel' },
      { name: 'list_channel_integrations', label: 'List Channels', description: 'View connected platforms' },
      { name: 'search_channel_messages', label: 'Search Messages', description: 'Find channel messages' },
    ],
  },
  {
    label: 'Canvas',
    icon: Palette,
    tools: [
      { name: 'create_canvas', label: 'Create Canvas', description: 'New design workspace' },
      { name: 'generate_on_canvas', label: 'Generate', description: 'AI generation on canvas' },
      { name: 'list_canvases', label: 'List Canvases', description: 'Browse canvases' },
    ],
  },
];

// ============================================================================
// TPMJS categories for browsing
// ============================================================================

const TPMJS_CATEGORIES = [
  { id: 'web-scraping', label: 'Web Scraping', icon: Search },
  { id: 'search-engines', label: 'Search', icon: Search },
  { id: 'ai-models', label: 'AI Models', icon: Sparkles },
  { id: 'data-processing', label: 'Data', icon: Code },
  { id: 'image-processing', label: 'Images', icon: ImageIcon },
  { id: 'weather', label: 'Weather', icon: CloudSun },
  { id: 'translation', label: 'Translation', icon: MessageSquare },
  { id: 'utilities', label: 'Utilities', icon: Wrench },
];

// ============================================================================
// Component
// ============================================================================

export function ToolProviderSelector({
  selectedTools,
  onToolsChange,
  className = '',
}: ToolProviderSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeProvider, setActiveProvider] = useState<ToolProvider>('legacy');
  const [tpmjsSearch, setTpmjsSearch] = useState('');
  const [tpmjsResults, setTpmjsResults] = useState<
    { toolId: string; name: string; description: string; category: string; qualityScore: number }[]
  >([]);
  const [isSearching, setIsSearching] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  // Toggle tool selection
  const toggleTool = useCallback(
    (name: string, provider: ToolProvider) => {
      const exists = selectedTools.some((t) => t.name === name && t.provider === provider);
      if (exists) {
        onToolsChange(selectedTools.filter((t) => !(t.name === name && t.provider === provider)));
      } else {
        onToolsChange([...selectedTools, { name, provider }]);
      }
    },
    [selectedTools, onToolsChange]
  );

  const isToolSelected = useCallback(
    (name: string, provider: ToolProvider) =>
      selectedTools.some((t) => t.name === name && t.provider === provider),
    [selectedTools]
  );

  // TPMJS search handler
  const handleTPMJSSearch = useCallback(async () => {
    if (!tpmjsSearch.trim()) return;
    setIsSearching(true);
    try {
      const client = getTPMJSClient();
      const result = await client.searchTools(tpmjsSearch, { limit: 10 });
      setTpmjsResults(
        result.tools.map((t: TPMJSTool) => ({
          toolId: t.toolId || `${t.packageName}::${t.toolName}`,
          name: t.name || t.toolName,
          description: t.description || '',
          category: t.category || 'general',
          qualityScore: t.qualityScore || 0,
        }))
      );
    } catch {
      setTpmjsResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [tpmjsSearch]);

  const selectedCount = selectedTools.length;

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      <motion.button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative p-3 rounded-full transition-all flex-shrink-0 min-w-[44px] min-h-[44px]"
        style={{
          background: isOpen
            ? 'hsl(var(--theme-primary) / 0.2)'
            : selectedCount > 0
              ? 'hsl(var(--theme-primary) / 0.15)'
              : 'hsl(var(--theme-chat-input-bg, var(--theme-muted)))',
          color: isOpen || selectedCount > 0
            ? 'hsl(var(--theme-primary))'
            : 'hsl(var(--theme-chat-input-fg, var(--theme-muted-foreground)))',
        }}
        aria-label={`Tool provider selector${selectedCount > 0 ? ` (${selectedCount} selected)` : ''}`}
        aria-expanded={isOpen}
      >
        <Wrench className="w-5 h-5" />
        {/* Count badge */}
        <AnimatePresence>
          {selectedCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[10px] font-semibold"
              style={{
                background: 'hsl(var(--theme-primary))',
                color: 'hsl(var(--theme-primary-foreground))',
              }}
            >
              {selectedCount}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Upward Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="absolute bottom-full left-0 mb-2 w-[340px] max-h-[60vh] rounded-2xl overflow-hidden shadow-2xl z-50"
            style={{
              background: 'hsl(var(--theme-card) / 0.95)',
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
              border: '1px solid hsl(var(--theme-border) / 0.5)',
              boxShadow: '0 -8px 40px hsl(var(--theme-background) / 0.4), 0 -2px 12px hsl(var(--theme-border) / 0.2)',
            }}
          >
            {/* Header */}
            <div className="px-4 pt-3 pb-2 flex items-center justify-between">
              <span
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: 'hsl(var(--theme-muted-foreground))' }}
              >
                Tool Provider
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                aria-label="Close tool selector"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Segmented Control */}
            <div className="px-4 pb-3">
              <div
                className="flex p-0.5 rounded-xl"
                style={{ background: 'hsl(var(--theme-muted) / 0.5)' }}
                role="tablist"
                aria-label="Tool provider"
              >
                {(['legacy', 'tpmjs'] as const).map((provider) => (
                  <button
                    key={provider}
                    role="tab"
                    aria-selected={activeProvider === provider}
                    onClick={() => setActiveProvider(provider)}
                    className="relative flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-[10px] text-xs font-medium transition-colors min-h-[44px]"
                    style={{
                      color: activeProvider === provider
                        ? 'hsl(var(--theme-foreground))'
                        : 'hsl(var(--theme-muted-foreground))',
                    }}
                  >
                    {activeProvider === provider && (
                      <motion.div
                        layoutId="provider-tab-bg"
                        className="absolute inset-0 rounded-[10px]"
                        style={{
                          background: 'hsl(var(--theme-card))',
                          boxShadow: '0 1px 3px hsl(var(--theme-background) / 0.2)',
                        }}
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5">
                      {provider === 'legacy' ? (
                        <Wrench className="w-3.5 h-3.5" />
                      ) : (
                        <Package className="w-3.5 h-3.5" />
                      )}
                      {provider === 'legacy' ? 'Legacy' : 'TPMJS'}
                    </span>
                    {/* Selected count per provider */}
                    {selectedTools.filter((t) => t.provider === provider).length > 0 && (
                      <span
                        className="relative z-10 min-w-[16px] h-[16px] flex items-center justify-center rounded-full text-[9px] font-bold"
                        style={{
                          background: 'hsl(var(--theme-primary) / 0.2)',
                          color: 'hsl(var(--theme-primary))',
                        }}
                      >
                        {selectedTools.filter((t) => t.provider === provider).length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Separator */}
            <div
              className="h-px mx-4"
              style={{ background: 'hsl(var(--theme-border) / 0.3)' }}
            />

            {/* Content */}
            <div
              className="overflow-y-auto overscroll-contain"
              style={{ maxHeight: 'calc(60vh - 110px)' }}
            >
              <AnimatePresence mode="wait">
                {activeProvider === 'legacy' ? (
                  <motion.div
                    key="legacy"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{ duration: 0.15 }}
                    className="py-2"
                  >
                    {LEGACY_TOOL_GROUPS.map((group) => (
                      <div key={group.label} className="mb-1">
                        {/* Group header */}
                        <div className="px-4 py-1.5 flex items-center gap-2">
                          <group.icon
                            className="w-3.5 h-3.5"
                            style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                          />
                          <span
                            className="text-[10px] font-semibold uppercase tracking-wider"
                            style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                          >
                            {group.label}
                          </span>
                        </div>
                        {/* Tools */}
                        {group.tools.map((tool) => (
                          <ToolRow
                            key={tool.name}
                            name={tool.name}
                            label={tool.label}
                            description={tool.description}
                            isSelected={isToolSelected(tool.name, 'legacy')}
                            onToggle={() => toggleTool(tool.name, 'legacy')}
                          />
                        ))}
                      </div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="tpmjs"
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.15 }}
                    className="py-2"
                  >
                    {/* TPMJS Search */}
                    <div className="px-4 pb-2">
                      <div
                        className="flex items-center gap-2 rounded-xl px-3 py-2"
                        style={{
                          background: 'hsl(var(--theme-muted) / 0.5)',
                          border: '1px solid hsl(var(--theme-border) / 0.3)',
                        }}
                      >
                        <Search
                          className="w-3.5 h-3.5 flex-shrink-0"
                          style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                        />
                        <input
                          type="text"
                          value={tpmjsSearch}
                          onChange={(e) => setTpmjsSearch(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleTPMJSSearch();
                          }}
                          placeholder="Search TPMJS registry..."
                          className="flex-1 bg-transparent text-xs outline-none min-h-[44px]"
                          style={{
                            color: 'hsl(var(--theme-foreground))',
                          }}
                        />
                        {isSearching && (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                          >
                            <Sparkles
                              className="w-3.5 h-3.5"
                              style={{ color: 'hsl(var(--theme-primary))' }}
                            />
                          </motion.div>
                        )}
                      </div>
                    </div>

                    {/* TPMJS Categories */}
                    {tpmjsResults.length === 0 && !isSearching && (
                      <div className="px-4 pb-2">
                        <span
                          className="text-[10px] uppercase tracking-wider font-semibold"
                          style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                        >
                          Browse Categories
                        </span>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {TPMJS_CATEGORIES.map((cat) => (
                            <button
                              key={cat.id}
                              onClick={() => {
                                setTpmjsSearch(cat.label.toLowerCase());
                                setTimeout(() => handleTPMJSSearch(), 0);
                              }}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all active:scale-95 min-h-[44px]"
                              style={{
                                background: 'hsl(var(--theme-muted) / 0.3)',
                                color: 'hsl(var(--theme-muted-foreground))',
                                border: '1px solid hsl(var(--theme-border) / 0.2)',
                              }}
                            >
                              <cat.icon className="w-3 h-3" />
                              {cat.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* TPMJS Built-in tools (always available) */}
                    <div className="px-4 py-1.5 flex items-center gap-2">
                      <HeartPulse
                        className="w-3.5 h-3.5"
                        style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                      />
                      <span
                        className="text-[10px] font-semibold uppercase tracking-wider"
                        style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                      >
                        Built-in TPMJS
                      </span>
                    </div>
                    <ToolRow
                      name="search_tpmjs_tools"
                      label="Search Registry"
                      description="Find tools in the TPMJS ecosystem"
                      isSelected={isToolSelected('search_tpmjs_tools', 'tpmjs')}
                      onToggle={() => toggleTool('search_tpmjs_tools', 'tpmjs')}
                    />
                    <ToolRow
                      name="execute_tpmjs_tool"
                      label="Execute Tool"
                      description="Run any TPMJS registry tool"
                      isSelected={isToolSelected('execute_tpmjs_tool', 'tpmjs')}
                      onToggle={() => toggleTool('execute_tpmjs_tool', 'tpmjs')}
                    />
                    <ToolRow
                      name="check_tpmjs_executor"
                      label="Health Check"
                      description="Verify TPMJS executor status"
                      isSelected={isToolSelected('check_tpmjs_executor', 'tpmjs')}
                      onToggle={() => toggleTool('check_tpmjs_executor', 'tpmjs')}
                    />

                    {/* TPMJS Search Results */}
                    {tpmjsResults.length > 0 && (
                      <>
                        <div className="px-4 pt-2 pb-1 flex items-center gap-2">
                          <Package
                            className="w-3.5 h-3.5"
                            style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                          />
                          <span
                            className="text-[10px] font-semibold uppercase tracking-wider"
                            style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                          >
                            Registry Results ({tpmjsResults.length})
                          </span>
                        </div>
                        {tpmjsResults.map((tool) => (
                          <ToolRow
                            key={tool.toolId}
                            name={tool.toolId}
                            label={tool.name}
                            description={tool.description}
                            isSelected={isToolSelected(tool.toolId, 'tpmjs')}
                            onToggle={() => toggleTool(tool.toolId, 'tpmjs')}
                            badge={tool.category}
                            quality={tool.qualityScore}
                          />
                        ))}
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer - clear all */}
            {selectedCount > 0 && (
              <div
                className="px-4 py-2 flex items-center justify-between"
                style={{
                  borderTop: '1px solid hsl(var(--theme-border) / 0.3)',
                  background: 'hsl(var(--theme-muted) / 0.2)',
                }}
              >
                <span
                  className="text-[11px]"
                  style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                >
                  {selectedCount} tool{selectedCount !== 1 ? 's' : ''} selected
                </span>
                <button
                  onClick={() => onToolsChange([])}
                  className="text-[11px] font-medium px-2 py-1 rounded-lg transition-all active:scale-95 min-h-[44px]"
                  style={{ color: 'hsl(var(--theme-primary))' }}
                >
                  Clear All
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// Tool Row Component
// ============================================================================

interface ToolRowProps {
  name: string;
  label: string;
  description: string;
  isSelected: boolean;
  onToggle: () => void;
  badge?: string;
  quality?: number;
}

function ToolRow({ label, description, isSelected, onToggle, badge, quality }: ToolRowProps) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center gap-3 px-4 py-2 transition-colors text-left group min-h-[44px]"
      style={{
        background: isSelected ? 'hsl(var(--theme-primary) / 0.06)' : 'transparent',
      }}
      role="option"
      aria-selected={isSelected}
    >
      {/* Checkbox */}
      <div
        className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all"
        style={{
          background: isSelected
            ? 'hsl(var(--theme-primary))'
            : 'hsl(var(--theme-muted) / 0.5)',
          border: isSelected
            ? 'none'
            : '1.5px solid hsl(var(--theme-border) / 0.5)',
        }}
      >
        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              <Check
                className="w-3 h-3"
                style={{ color: 'hsl(var(--theme-primary-foreground))' }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span
            className="text-xs font-medium truncate"
            style={{ color: 'hsl(var(--theme-foreground))' }}
          >
            {label}
          </span>
          {badge && (
            <span
              className="text-[9px] px-1.5 py-0.5 rounded-full"
              style={{
                background: 'hsl(var(--theme-muted) / 0.5)',
                color: 'hsl(var(--theme-muted-foreground))',
              }}
            >
              {badge}
            </span>
          )}
          {quality !== undefined && quality > 0 && (
            <span
              className="text-[9px]"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              {(quality * 100).toFixed(0)}%
            </span>
          )}
        </div>
        <span
          className="text-[11px] truncate block"
          style={{ color: 'hsl(var(--theme-muted-foreground))' }}
        >
          {description}
        </span>
      </div>
    </button>
  );
}

// ============================================================================
// Selected Tools Chips (for display above input)
// ============================================================================

export function SelectedToolsChips({
  tools,
  onRemove,
}: {
  tools: SelectedTool[];
  onRemove: (tool: SelectedTool) => void;
}) {
  if (tools.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="flex flex-wrap gap-1.5 mb-2"
    >
      {tools.map((tool) => (
        <motion.span
          key={`${tool.provider}-${tool.name}`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium transition-all min-h-[44px]"
          style={{
            background: tool.provider === 'tpmjs'
              ? 'hsl(var(--theme-primary) / 0.1)'
              : 'hsl(var(--theme-muted) / 0.5)',
            color: tool.provider === 'tpmjs'
              ? 'hsl(var(--theme-primary))'
              : 'hsl(var(--theme-muted-foreground))',
            border: `1px solid ${tool.provider === 'tpmjs'
                ? 'hsl(var(--theme-primary) / 0.2)'
                : 'hsl(var(--theme-border) / 0.3)'
              }`,
          }}
        >
          {tool.provider === 'tpmjs' ? (
            <Package className="w-2.5 h-2.5" />
          ) : (
            <Wrench className="w-2.5 h-2.5" />
          )}
          {tool.name.includes('::') ? tool.name.split('::')[1] : tool.name.replace(/_/g, ' ')}
          <button
            onClick={() => onRemove(tool)}
            className="ml-0.5 rounded-full transition-colors hover:opacity-70 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label={`Remove ${tool.name}`}
          >
            <X className="w-2.5 h-2.5" />
          </button>
        </motion.span>
      ))}
    </motion.div>
  );
}

export default ToolProviderSelector;
