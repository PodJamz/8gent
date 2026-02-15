'use client';

import { motion } from 'framer-motion';
import { Search, Navigation, Calendar, Palette, Check, Loader2, ExternalLink, CloudSun, FolderKanban, Image as ImageIcon, Boxes } from 'lucide-react';
import Link from 'next/link';
import {
  WeatherWidget,
  KanbanTicketList,
  PhotoGallery,
  ThemePreviewCard,
} from './ChatComponents';
import { AiJamesUIRenderer, parseUITree } from '@/lib/ai-james/json-render-provider';

// Tool execution status
type ToolStatus = 'pending' | 'executing' | 'complete' | 'error';

interface ToolExecutionProps {
  toolName: string;
  status: ToolStatus;
  result?: {
    success: boolean;
    data?: Record<string, unknown>;
    error?: string;
  };
  onNavigate?: (url: string) => void;
}

// Map tool names to icons and labels
const TOOL_CONFIG: Record<string, { icon: typeof Search; label: string; activeLabel: string }> = {
  search_portfolio: {
    icon: Search,
    label: 'Search Portfolio',
    activeLabel: 'Searching portfolio...',
  },
  navigate_to: {
    icon: Navigation,
    label: 'Navigate',
    activeLabel: 'Navigating...',
  },
  schedule_call: {
    icon: Calendar,
    label: 'Schedule Call',
    activeLabel: 'Opening calendar...',
  },
  list_themes: {
    icon: Palette,
    label: 'List Themes',
    activeLabel: 'Loading themes...',
  },
  open_search_app: {
    icon: Search,
    label: 'Open Search',
    activeLabel: 'Opening Search app...',
  },
  show_weather: {
    icon: CloudSun,
    label: 'Weather',
    activeLabel: 'Loading weather...',
  },
  show_kanban_tasks: {
    icon: FolderKanban,
    label: 'Tasks',
    activeLabel: 'Loading tasks...',
  },
  show_photos: {
    icon: ImageIcon,
    label: 'Photos',
    activeLabel: 'Loading photos...',
  },
  render_ui: {
    icon: Boxes,
    label: 'Custom UI',
    activeLabel: 'Rendering UI...',
  },
};

export function ToolExecution({ toolName, status, result, onNavigate }: ToolExecutionProps) {
  const config = TOOL_CONFIG[toolName] || {
    icon: Search,
    label: toolName,
    activeLabel: 'Processing...',
  };

  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 rounded-xl border border-white/10 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-white/5">
        <div className={`p-1.5 rounded-lg ${status === 'complete' ? 'bg-green-500/20' : 'bg-white/10'}`}>
          {status === 'executing' ? (
            <Loader2 className="w-3.5 h-3.5 text-white/60 animate-spin" />
          ) : status === 'complete' ? (
            <Check className="w-3.5 h-3.5 text-green-400" />
          ) : (
            <Icon className="w-3.5 h-3.5 text-white/60" />
          )}
        </div>
        <span className="text-xs text-white/60">
          {status === 'executing' ? config.activeLabel : config.label}
        </span>
      </div>

      {/* Results */}
      {status === 'complete' && result?.success && (
        <div className="p-3">
          <ToolResultDisplay toolName={toolName} data={result.data} onNavigate={onNavigate} />
        </div>
      )}

      {/* Error */}
      {status === 'error' && result?.error && (
        <div className="p-3">
          <p className="text-xs text-red-400">{result.error}</p>
        </div>
      )}
    </motion.div>
  );
}

// Display results based on tool type
interface ToolResultDisplayProps {
  toolName: string;
  data?: Record<string, unknown>;
  onNavigate?: (url: string) => void;
}

function ToolResultDisplay({ toolName, data, onNavigate }: ToolResultDisplayProps) {
  if (!data) return null;

  switch (toolName) {
    case 'search_portfolio':
      return <SearchResults data={data} />;

    case 'navigate_to':
      return <NavigationResult data={data} onNavigate={onNavigate} />;

    case 'schedule_call':
      return <ScheduleResult data={data} />;

    case 'list_themes':
      return <ThemesResult data={data} />;

    case 'open_search_app':
      return <OpenSearchResult data={data} />;

    case 'show_weather':
      return <WeatherResult data={data} />;

    case 'show_kanban_tasks':
      return <KanbanResult data={data} />;

    case 'show_photos':
      return <PhotosResult data={data} />;

    case 'render_ui':
      return <RenderUIResult data={data} />;

    default:
      return (
        <pre className="text-xs text-white/60 overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      );
  }
}

// Search results display
function SearchResults({ data }: { data: Record<string, unknown> }) {
  const results = data.results as Array<{
    type: string;
    title: string;
    description: string;
    url?: string;
  }> | undefined;

  if (!results || results.length === 0) {
    return <p className="text-xs text-white/50">No results found</p>;
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-white/50">Found {results.length} results</p>
      <div className="space-y-1.5 max-h-40 overflow-y-auto">
        {results.slice(0, 5).map((r) => (
          <div key={`${r.type}-${r.title}-${r.url || ''}`} className="flex items-start gap-2 p-2 rounded-lg bg-white/5">
            <span className="text-[10px] uppercase text-white/30 mt-0.5">{r.type}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white/80 truncate">{r.title}</p>
              {r.url && (
                <Link
                  href={r.url}
                  className="text-[10px] text-amber-400/80 hover:text-amber-400 inline-flex items-center gap-1"
                >
                  View <ExternalLink className="w-2.5 h-2.5" />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Navigation result display
function NavigationResult({
  data,
  onNavigate,
}: {
  data: Record<string, unknown>;
  onNavigate?: (url: string) => void;
}) {
  const url = data.url as string | undefined;
  const message = data.message as string | undefined;

  return (
    <div className="space-y-2">
      <p className="text-xs text-white/60">{message || 'Ready to navigate'}</p>
      {url && onNavigate && (
        <button
          onClick={() => onNavigate(url)}
          className="text-xs text-amber-400 hover:text-amber-300 inline-flex items-center gap-1 transition-colors"
        >
          Go to page <Navigation className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

// Schedule result display
function ScheduleResult({ data }: { data: Record<string, unknown> }) {
  const url = data.url as string | undefined;
  const message = data.message as string | undefined;

  return (
    <div className="space-y-2">
      <p className="text-xs text-white/60">{message || 'Opening calendar...'}</p>
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-amber-400 hover:text-amber-300 inline-flex items-center gap-1 transition-colors"
        >
          Open Calendar <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </div>
  );
}

// Themes result display
function ThemesResult({ data }: { data: Record<string, unknown> }) {
  const themes = data.themes as Array<{ name: string; label: string; url: string }> | undefined;
  const count = data.count as number | undefined;

  if (!themes) return null;

  return (
    <div className="space-y-2">
      <p className="text-xs text-white/50">{count} themes available</p>
      <div className="grid grid-cols-2 gap-2">
        {themes.slice(0, 4).map((t) => (
          <ThemePreviewCard key={t.name} theme={{ name: t.name, label: t.label }} />
        ))}
      </div>
      {themes.length > 4 && (
        <Link
          href="/design"
          className="text-xs text-amber-400 hover:text-amber-300 inline-flex items-center gap-1"
        >
          +{themes.length - 4} more themes <ExternalLink className="w-3 h-3" />
        </Link>
      )}
    </div>
  );
}

// Open Search App result
function OpenSearchResult({ data }: { data: Record<string, unknown> }) {
  const message = data.message as string | undefined;
  const query = data.query as string | undefined;

  return (
    <div className="space-y-2">
      <p className="text-xs text-white/60">{message || 'Opening Search...'}</p>
      {query && (
        <p className="text-[10px] text-white/40">Query: "{query}"</p>
      )}
    </div>
  );
}

// Weather result display
function WeatherResult({ data }: { data: Record<string, unknown> }) {
  const weatherData = data as {
    location: string;
    temperature: number;
    condition: 'sunny' | 'cloudy' | 'rainy' | 'windy';
    humidity?: number;
    windSpeed?: number;
  };

  return <WeatherWidget data={weatherData} />;
}

// Kanban tasks result display
function KanbanResult({ data }: { data: Record<string, unknown> }) {
  const tasks = data.tasks as Array<{
    id: string;
    title: string;
    description?: string;
    status: 'todo' | 'in-progress' | 'done' | 'backlog';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    tags?: string[];
  }> | undefined;

  if (!tasks || tasks.length === 0) {
    return <p className="text-xs text-white/50">No tasks found</p>;
  }

  return <KanbanTicketList tickets={tasks} />;
}

// Photos result display
function PhotosResult({ data }: { data: Record<string, unknown> }) {
  const photos = data.photos as Array<{
    id: string;
    src: string;
    alt: string;
    caption?: string;
  }> | undefined;

  if (!photos || photos.length === 0) {
    return <p className="text-xs text-white/50">No photos found</p>;
  }

  return <PhotoGallery photos={photos} />;
}

// Render UI result display - uses json-render
function RenderUIResult({ data }: { data: Record<string, unknown> }) {
  const title = data.title as string | undefined;
  const uiTreeData = data.ui_tree as Record<string, unknown> | undefined;

  if (!uiTreeData) {
    return <p className="text-xs text-white/50">No UI to render</p>;
  }

  const tree = parseUITree(uiTreeData);

  if (!tree) {
    return (
      <div className="text-xs text-red-400">
        Invalid UI tree structure
        <pre className="text-white/40 mt-1 overflow-auto text-[10px]">
          {JSON.stringify(uiTreeData, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {title && <p className="text-xs text-white/50 font-medium">{title}</p>}
      <AiJamesUIRenderer tree={tree} />
    </div>
  );
}

export default ToolExecution;
