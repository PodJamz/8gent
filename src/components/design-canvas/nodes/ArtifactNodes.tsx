'use client';

/**
 * Artifact Nodes - Claude-style artifact frames for the canvas
 *
 * These are rich content nodes that can display:
 * - Documents (markdown)
 * - Code blocks
 * - Charts
 * - Tables
 * - Diagrams
 * - Tickets/User Stories
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Code2,
  BarChart3,
  Table2,
  GitBranch,
  Image,
  Ticket,
  Copy,
  Maximize2,
  Minimize2,
  X,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Artifact, ArtifactType } from '@/lib/canvas/artifacts';

// ============================================================================
// Types
// ============================================================================

interface ArtifactNodeProps {
  artifact: Partial<Artifact>;
  isSelected?: boolean;
  onSelect?: () => void;
  onDelete?: () => void;
  onExpand?: () => void;
  width?: number;
  height?: number;
}

// ============================================================================
// Artifact Header
// ============================================================================

function ArtifactHeader({
  type,
  title,
  onCopy,
  onExpand,
  onClose,
  color,
}: {
  type: ArtifactType;
  title: string;
  onCopy?: () => void;
  onExpand?: () => void;
  onClose?: () => void;
  color: string;
}) {
  const [copied, setCopied] = useState(false);

  const getIcon = () => {
    switch (type) {
      case 'document': return <FileText className="w-3.5 h-3.5" />;
      case 'code': return <Code2 className="w-3.5 h-3.5" />;
      case 'chart': return <BarChart3 className="w-3.5 h-3.5" />;
      case 'table': return <Table2 className="w-3.5 h-3.5" />;
      case 'diagram': return <GitBranch className="w-3.5 h-3.5" />;
      case 'image': return <Image className="w-3.5 h-3.5" />;
      case 'ticket':
      case 'user-story':
      case 'prd':
        return <Ticket className="w-3.5 h-3.5" />;
      default: return <FileText className="w-3.5 h-3.5" />;
    }
  };

  const handleCopy = () => {
    onCopy?.();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="flex items-center justify-between px-3 py-2 border-b border-white/10"
      style={{ backgroundColor: `${color}15` }}
    >
      <div className="flex items-center gap-2">
        <span style={{ color }}>{getIcon()}</span>
        <span className="text-xs font-medium text-white/80 truncate max-w-[200px]">
          {title}
        </span>
      </div>
      <div className="flex items-center gap-1">
        {onCopy && (
          <button
            onClick={handleCopy}
            className="p-1 rounded hover:bg-white/10 transition-colors"
          >
            {copied ? (
              <Check className="w-3 h-3 text-green-400" />
            ) : (
              <Copy className="w-3 h-3 text-white/40" />
            )}
          </button>
        )}
        {onExpand && (
          <button
            onClick={onExpand}
            className="p-1 rounded hover:bg-white/10 transition-colors"
          >
            <Maximize2 className="w-3 h-3 text-white/40" />
          </button>
        )}
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-white/10 transition-colors"
          >
            <X className="w-3 h-3 text-white/40" />
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Document Artifact
// ============================================================================

export function DocumentArtifactNode({ artifact, isSelected, onSelect, onDelete, width = 400, height = 300 }: ArtifactNodeProps) {
  const content = (artifact as any).content || '';

  return (
    <motion.div
      className={cn(
        'rounded-xl overflow-hidden shadow-xl',
        isSelected && 'ring-2 ring-purple-500'
      )}
      style={{
        width,
        height,
        backgroundColor: '#1e1e2e',
        border: '1px solid rgba(99, 102, 241, 0.3)',
      }}
      onClick={onSelect}
      whileHover={{ scale: 1.01 }}
    >
      <ArtifactHeader
        type="document"
        title={artifact.title || 'Document'}
        color="#6366f1"
        onCopy={() => navigator.clipboard.writeText(content)}
        onClose={onDelete}
      />
      <div className="p-4 overflow-auto" style={{ height: height - 44 }}>
        <div className="prose prose-invert prose-sm max-w-none">
          {/* Simple markdown rendering - in production use react-markdown */}
          <pre className="whitespace-pre-wrap text-sm text-white/80 font-sans">
            {content}
          </pre>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// Code Artifact
// ============================================================================

export function CodeArtifactNode({ artifact, isSelected, onSelect, onDelete, width = 450, height = 250 }: ArtifactNodeProps) {
  const content = (artifact as any).content || '';
  const language = (artifact as any).language || 'javascript';

  return (
    <motion.div
      className={cn(
        'rounded-xl overflow-hidden shadow-xl',
        isSelected && 'ring-2 ring-purple-500'
      )}
      style={{
        width,
        height,
        backgroundColor: '#0d1117',
        border: '1px solid #30363d',
      }}
      onClick={onSelect}
      whileHover={{ scale: 1.01 }}
    >
      <ArtifactHeader
        type="code"
        title={`${language} code`}
        color="#30a14e"
        onCopy={() => navigator.clipboard.writeText(content)}
        onClose={onDelete}
      />
      <div className="overflow-auto" style={{ height: height - 44 }}>
        <pre className="p-4 text-sm font-mono text-[#c9d1d9] overflow-x-auto">
          <code>{content}</code>
        </pre>
      </div>
    </motion.div>
  );
}

// ============================================================================
// Chart Artifact
// ============================================================================

export function ChartArtifactNode({ artifact, isSelected, onSelect, onDelete, width = 400, height = 300 }: ArtifactNodeProps) {
  const chartData = (artifact as any).data || { labels: [], datasets: [] };
  const chartType = (artifact as any).chartType || 'bar';

  // Simple bar chart visualization
  const maxValue = Math.max(...(chartData.datasets?.[0]?.data || [1]));

  return (
    <motion.div
      className={cn(
        'rounded-xl overflow-hidden shadow-xl',
        isSelected && 'ring-2 ring-purple-500'
      )}
      style={{
        width,
        height,
        backgroundColor: '#1a1a2e',
        border: '1px solid rgba(59, 130, 246, 0.3)',
      }}
      onClick={onSelect}
      whileHover={{ scale: 1.01 }}
    >
      <ArtifactHeader
        type="chart"
        title={artifact.title || 'Chart'}
        color="#3b82f6"
        onClose={onDelete}
      />
      <div className="p-4 flex items-end gap-2" style={{ height: height - 44 }}>
        {chartType === 'bar' && chartData.labels?.map((label: string, i: number) => {
          const value = chartData.datasets?.[0]?.data?.[i] || 0;
          const barHeight = (value / maxValue) * (height - 100);
          const color = chartData.datasets?.[0]?.color || '#3b82f6';

          return (
            <div key={label} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-t transition-all"
                style={{
                  height: barHeight,
                  backgroundColor: color,
                  minHeight: 4,
                }}
              />
              <span className="text-[10px] text-white/50 truncate max-w-full">
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ============================================================================
// Table Artifact
// ============================================================================

export function TableArtifactNode({ artifact, isSelected, onSelect, onDelete, width = 500, height = 250 }: ArtifactNodeProps) {
  const columns = (artifact as any).columns || [];
  const rows = (artifact as any).rows || [];

  return (
    <motion.div
      className={cn(
        'rounded-xl overflow-hidden shadow-xl',
        isSelected && 'ring-2 ring-purple-500'
      )}
      style={{
        width,
        height,
        backgroundColor: '#1a1a2e',
        border: '1px solid rgba(16, 185, 129, 0.3)',
      }}
      onClick={onSelect}
      whileHover={{ scale: 1.01 }}
    >
      <ArtifactHeader
        type="table"
        title={artifact.title || 'Table'}
        color="#10b981"
        onClose={onDelete}
      />
      <div className="overflow-auto" style={{ height: height - 44 }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              {columns.map((col: any) => (
                <th
                  key={col.key}
                  className="px-3 py-2 text-left text-xs font-medium text-white/60"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row: any, i: number) => (
              <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                {columns.map((col: any) => (
                  <td key={col.key} className="px-3 py-2 text-white/80">
                    {row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

// ============================================================================
// Ticket/User Story Artifact
// ============================================================================

export function TicketArtifactNode({ artifact, isSelected, onSelect, onDelete, width = 320, height = 200 }: ArtifactNodeProps) {
  const asA = (artifact as any).asA || '';
  const iWant = (artifact as any).iWant || '';
  const soThat = (artifact as any).soThat || '';
  const priority = (artifact as any).priority || 'P2';
  const status = (artifact as any).status || 'backlog';

  const priorityColors: Record<string, string> = {
    P0: '#ef4444',
    P1: '#f59e0b',
    P2: '#3b82f6',
    P3: '#6b7280',
  };

  const statusColors: Record<string, string> = {
    backlog: '#6b7280',
    todo: '#3b82f6',
    in_progress: '#f59e0b',
    review: '#8b5cf6',
    done: '#10b981',
  };

  return (
    <motion.div
      className={cn(
        'rounded-xl overflow-hidden shadow-xl',
        isSelected && 'ring-2 ring-purple-500'
      )}
      style={{
        width,
        height,
        backgroundColor: '#1a1a2e',
        border: '1px solid rgba(245, 158, 11, 0.3)',
      }}
      onClick={onSelect}
      whileHover={{ scale: 1.01 }}
    >
      <ArtifactHeader
        type="ticket"
        title={artifact.title || (artifact as any).ticketId || 'User Story'}
        color="#f59e0b"
        onClose={onDelete}
      />
      <div className="p-4 space-y-3" style={{ height: height - 44 }}>
        {/* Priority and Status */}
        <div className="flex items-center gap-2">
          <span
            className="px-2 py-0.5 rounded text-[10px] font-bold"
            style={{ backgroundColor: `${priorityColors[priority]}20`, color: priorityColors[priority] }}
          >
            {priority}
          </span>
          <span
            className="px-2 py-0.5 rounded text-[10px] font-medium"
            style={{ backgroundColor: `${statusColors[status]}20`, color: statusColors[status] }}
          >
            {status.replace('_', ' ')}
          </span>
        </div>

        {/* User Story Format */}
        <div className="space-y-1 text-sm">
          {asA && (
            <p className="text-white/70">
              <span className="text-white/40">As a</span>{' '}
              <span className="text-white font-medium">{asA}</span>
            </p>
          )}
          {iWant && (
            <p className="text-white/70">
              <span className="text-white/40">I want</span>{' '}
              <span className="text-white font-medium">{iWant}</span>
            </p>
          )}
          {soThat && (
            <p className="text-white/70">
              <span className="text-white/40">So that</span>{' '}
              <span className="text-white font-medium">{soThat}</span>
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// PRD Artifact
// ============================================================================

export function PRDArtifactNode({ artifact, isSelected, onSelect, onDelete, width = 450, height = 350 }: ArtifactNodeProps) {
  const problem = (artifact as any).problem || '';
  const solution = (artifact as any).solution || '';
  const targetUser = (artifact as any).targetUser || '';
  const features = (artifact as any).features || [];

  return (
    <motion.div
      className={cn(
        'rounded-xl overflow-hidden shadow-xl',
        isSelected && 'ring-2 ring-purple-500'
      )}
      style={{
        width,
        height,
        backgroundColor: '#1a1a2e',
        border: '1px solid rgba(236, 72, 153, 0.3)',
      }}
      onClick={onSelect}
      whileHover={{ scale: 1.01 }}
    >
      <ArtifactHeader
        type="prd"
        title={artifact.title || 'PRD'}
        color="#ec4899"
        onClose={onDelete}
      />
      <div className="p-4 space-y-3 overflow-auto" style={{ height: height - 44 }}>
        {targetUser && (
          <div>
            <h4 className="text-[10px] uppercase text-white/40 font-medium mb-1">Target User</h4>
            <p className="text-sm text-white/80">{targetUser}</p>
          </div>
        )}
        {problem && (
          <div>
            <h4 className="text-[10px] uppercase text-white/40 font-medium mb-1">Problem</h4>
            <p className="text-sm text-white/80">{problem}</p>
          </div>
        )}
        {solution && (
          <div>
            <h4 className="text-[10px] uppercase text-white/40 font-medium mb-1">Solution</h4>
            <p className="text-sm text-white/80">{solution}</p>
          </div>
        )}
        {features.length > 0 && (
          <div>
            <h4 className="text-[10px] uppercase text-white/40 font-medium mb-1">Features</h4>
            <ul className="space-y-1">
              {features.slice(0, 5).map((f: string, i: number) => (
                <li key={i} className="text-sm text-white/80 flex items-start gap-2">
                  <span className="text-pink-400">•</span>
                  {f}
                </li>
              ))}
              {features.length > 5 && (
                <li className="text-xs text-white/40">+{features.length - 5} more</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ============================================================================
// Image Artifact
// ============================================================================

export function ImageArtifactNode({ artifact, isSelected, onSelect, onDelete, width = 400, height = 300 }: ArtifactNodeProps) {
  const src = (artifact as any).src || '';
  const alt = (artifact as any).alt || 'Generated image';

  return (
    <motion.div
      className={cn(
        'rounded-xl overflow-hidden shadow-xl',
        isSelected && 'ring-2 ring-purple-500'
      )}
      style={{
        width,
        height,
        backgroundColor: '#0a0a0a',
        border: '1px solid #525252',
      }}
      onClick={onSelect}
      whileHover={{ scale: 1.01 }}
    >
      <ArtifactHeader
        type="image"
        title={artifact.title || 'Image'}
        color="#a855f7"
        onClose={onDelete}
      />
      <div className="flex items-center justify-center" style={{ height: height - 44 }}>
        {src ? (
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <div className="text-white/30 text-sm">No image</div>
        )}
      </div>
    </motion.div>
  );
}

// ============================================================================
// Generic Artifact Node Renderer
// ============================================================================

export function ArtifactNode(props: ArtifactNodeProps) {
  const { artifact } = props;

  switch (artifact.type) {
    case 'document':
      return <DocumentArtifactNode {...props} />;
    case 'code':
      return <CodeArtifactNode {...props} />;
    case 'chart':
      return <ChartArtifactNode {...props} />;
    case 'table':
      return <TableArtifactNode {...props} />;
    case 'ticket':
    case 'user-story':
      return <TicketArtifactNode {...props} />;
    case 'prd':
      return <PRDArtifactNode {...props} />;
    case 'image':
      return <ImageArtifactNode {...props} />;
    default:
      return <DocumentArtifactNode {...props} />;
  }
}

export default ArtifactNode;
