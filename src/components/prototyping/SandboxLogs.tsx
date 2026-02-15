'use client';

import React, { useRef, useEffect } from 'react';
import { Terminal, Trash2, ChevronDown } from 'lucide-react';
import type { LogEntry } from '@/contexts/SandboxContext';

// ============================================================================
// Types
// ============================================================================

interface SandboxLogsProps {
  logs: LogEntry[];
  onClear?: () => void;
  autoScroll?: boolean;
}

// ============================================================================
// Helpers
// ============================================================================

function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function getLogTypeStyles(type: LogEntry['type']): string {
  switch (type) {
    case 'command':
      return 'text-cyan-400';
    case 'output':
      return 'text-white/80';
    case 'error':
      return 'text-red-400';
    case 'system':
      return 'text-yellow-400';
    default:
      return 'text-white/60';
  }
}

function getLogPrefix(type: LogEntry['type']): string {
  switch (type) {
    case 'command':
      return '$';
    case 'output':
      return '>';
    case 'error':
      return '!';
    case 'system':
      return '*';
    default:
      return ' ';
  }
}

// ============================================================================
// Main Component
// ============================================================================

export function SandboxLogs({ logs, onClear, autoScroll = true }: SandboxLogsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = React.useState(true);

  // Auto-scroll to bottom when new logs appear
  useEffect(() => {
    if (autoScroll && isAtBottom && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, autoScroll, isAtBottom]);

  // Track scroll position
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      setIsAtBottom(scrollHeight - scrollTop - clientHeight < 50);
    }
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      setIsAtBottom(true);
    }
  };

  return (
    <div className="h-full flex flex-col bg-black/40 rounded-lg border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 bg-black/20">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-white/50" />
          <span className="text-xs font-medium text-white/50 uppercase tracking-wider">
            Logs
          </span>
          <span className="text-xs text-white/30">({logs.length})</span>
        </div>

        <div className="flex items-center gap-1">
          {!isAtBottom && (
            <button
              onClick={scrollToBottom}
              className="p-1 text-white/40 hover:text-white/60 rounded transition-colors"
              title="Scroll to bottom"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          )}
          {onClear && (
            <button
              onClick={onClear}
              className="p-1 text-white/40 hover:text-white/60 rounded transition-colors"
              title="Clear logs"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Log Content */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-auto p-2 font-mono text-xs"
      >
        {logs.length === 0 ? (
          <div className="text-white/30 text-center py-4">No logs yet</div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex gap-2 py-0.5 hover:bg-white/5 rounded px-1">
              <span className="text-white/30 shrink-0">{formatTimestamp(log.timestamp)}</span>
              <span className={`shrink-0 ${getLogTypeStyles(log.type)}`}>
                {getLogPrefix(log.type)}
              </span>
              <div className="flex-1 min-w-0">
                <span className={getLogTypeStyles(log.type)}>{log.message}</span>
                {log.details && (
                  <div className="text-white/40 mt-0.5 whitespace-pre-wrap break-all">
                    {log.details}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default SandboxLogs;
