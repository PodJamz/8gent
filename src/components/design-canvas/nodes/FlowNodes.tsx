'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Play,
  Square,
  Diamond,
  MonitorSmartphone,
  Database,
  HardDrive,
  Layers,
} from 'lucide-react';

type FlowNodeType =
  | 'flow-start'
  | 'flow-end'
  | 'flow-decision'
  | 'flow-process'
  | 'flow-screen'
  | 'flow-data'
  | 'flow-subprocess';

interface FlowNodeProps {
  type: FlowNodeType;
  label: string;
  description?: string;
  isSelected?: boolean;
  width?: number;
  height?: number;
  style?: {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
  };
  className?: string;
}

// Color presets for flow nodes
const FLOW_NODE_COLORS: Record<FlowNodeType, { fill: string; stroke: string; text: string }> = {
  'flow-start': { fill: '#10b981', stroke: '#059669', text: '#ffffff' },
  'flow-end': { fill: '#ef4444', stroke: '#dc2626', text: '#ffffff' },
  'flow-decision': { fill: '#f59e0b', stroke: '#d97706', text: '#000000' },
  'flow-process': { fill: '#3b82f6', stroke: '#2563eb', text: '#ffffff' },
  'flow-screen': { fill: '#8b5cf6', stroke: '#7c3aed', text: '#ffffff' },
  'flow-data': { fill: '#06b6d4', stroke: '#0891b2', text: '#ffffff' },
  'flow-subprocess': { fill: '#6366f1', stroke: '#4f46e5', text: '#ffffff' },
};

// Default dimensions for each node type
const FLOW_NODE_DIMENSIONS: Record<FlowNodeType, { width: number; height: number }> = {
  'flow-start': { width: 120, height: 50 },
  'flow-end': { width: 120, height: 50 },
  'flow-decision': { width: 140, height: 100 },
  'flow-process': { width: 160, height: 80 },
  'flow-screen': { width: 140, height: 90 },
  'flow-data': { width: 150, height: 70 },
  'flow-subprocess': { width: 160, height: 80 },
};

// Icons for each node type
const FLOW_NODE_ICONS: Record<FlowNodeType, React.ReactNode> = {
  'flow-start': <Play className="w-4 h-4" />,
  'flow-end': <Square className="w-4 h-4" />,
  'flow-decision': <Diamond className="w-4 h-4" />,
  'flow-process': <Layers className="w-4 h-4" />,
  'flow-screen': <MonitorSmartphone className="w-4 h-4" />,
  'flow-data': <Database className="w-4 h-4" />,
  'flow-subprocess': <HardDrive className="w-4 h-4" />,
};

// Start/End Node - Rounded pill shape
function StartEndNode({
  label,
  isStart,
  colors,
  width,
  height,
  isSelected,
}: {
  label: string;
  isStart: boolean;
  colors: { fill: string; stroke: string; text: string };
  width: number;
  height: number;
  isSelected: boolean;
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-center gap-2 font-medium text-sm',
        isSelected && 'ring-2 ring-white ring-offset-2 ring-offset-transparent'
      )}
      style={{
        width,
        height,
        backgroundColor: colors.fill,
        border: `2px solid ${colors.stroke}`,
        borderRadius: height / 2,
        color: colors.text,
      }}
    >
      {isStart ? <Play className="w-3 h-3" /> : <Square className="w-3 h-3" />}
      {label}
    </div>
  );
}

// Decision Node - Diamond shape
function DecisionNode({
  label,
  colors,
  width,
  height,
  isSelected,
}: {
  label: string;
  colors: { fill: string; stroke: string; text: string };
  width: number;
  height: number;
  isSelected: boolean;
}) {
  return (
    <div
      className={cn(
        'relative flex items-center justify-center',
        isSelected && 'filter drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]'
      )}
      style={{ width, height }}
    >
      {/* Diamond shape using CSS transform */}
      <div
        className="absolute inset-[10%]"
        style={{
          backgroundColor: colors.fill,
          border: `2px solid ${colors.stroke}`,
          transform: 'rotate(45deg)',
          borderRadius: 4,
        }}
      />
      {/* Label */}
      <span
        className="relative z-10 font-medium text-sm text-center px-2 max-w-[80%]"
        style={{ color: colors.text }}
      >
        {label}
      </span>
    </div>
  );
}

// Process Node - Rounded rectangle
function ProcessNode({
  label,
  description,
  colors,
  width,
  height,
  isSelected,
}: {
  label: string;
  description?: string;
  colors: { fill: string; stroke: string; text: string };
  width: number;
  height: number;
  isSelected: boolean;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-3 rounded-lg',
        isSelected && 'ring-2 ring-white ring-offset-2 ring-offset-transparent'
      )}
      style={{
        width,
        height,
        backgroundColor: colors.fill,
        border: `2px solid ${colors.stroke}`,
      }}
    >
      <span className="font-medium text-sm" style={{ color: colors.text }}>
        {label}
      </span>
      {description && (
        <span className="text-xs mt-1 opacity-80" style={{ color: colors.text }}>
          {description}
        </span>
      )}
    </div>
  );
}

// Screen Reference Node - Rectangle with screen icon
function ScreenNode({
  label,
  colors,
  width,
  height,
  isSelected,
}: {
  label: string;
  colors: { fill: string; stroke: string; text: string };
  width: number;
  height: number;
  isSelected: boolean;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-3 rounded-lg',
        isSelected && 'ring-2 ring-white ring-offset-2 ring-offset-transparent'
      )}
      style={{
        width,
        height,
        backgroundColor: colors.fill,
        border: `2px solid ${colors.stroke}`,
      }}
    >
      <MonitorSmartphone className="w-5 h-5 mb-1" style={{ color: colors.text }} />
      <span className="font-medium text-sm text-center" style={{ color: colors.text }}>
        {label}
      </span>
    </div>
  );
}

// Data/Storage Node - Parallelogram shape
function DataNode({
  label,
  colors,
  width,
  height,
  isSelected,
}: {
  label: string;
  colors: { fill: string; stroke: string; text: string };
  width: number;
  height: number;
  isSelected: boolean;
}) {
  return (
    <div
      className={cn(
        'relative flex items-center justify-center',
        isSelected && 'filter drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]'
      )}
      style={{ width, height }}
    >
      {/* Parallelogram using skew transform */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: colors.fill,
          border: `2px solid ${colors.stroke}`,
          transform: 'skewX(-10deg)',
          borderRadius: 4,
        }}
      />
      {/* Label */}
      <div className="relative z-10 flex items-center gap-2">
        <Database className="w-4 h-4" style={{ color: colors.text }} />
        <span className="font-medium text-sm" style={{ color: colors.text }}>
          {label}
        </span>
      </div>
    </div>
  );
}

// Subprocess Node - Double-bordered rectangle
function SubprocessNode({
  label,
  colors,
  width,
  height,
  isSelected,
}: {
  label: string;
  colors: { fill: string; stroke: string; text: string };
  width: number;
  height: number;
  isSelected: boolean;
}) {
  return (
    <div
      className={cn(
        'relative flex items-center justify-center p-3 rounded-lg',
        isSelected && 'ring-2 ring-white ring-offset-2 ring-offset-transparent'
      )}
      style={{
        width,
        height,
        backgroundColor: colors.fill,
        border: `2px solid ${colors.stroke}`,
      }}
    >
      {/* Inner border for subprocess indication */}
      <div
        className="absolute inset-2 rounded border-2 pointer-events-none"
        style={{ borderColor: colors.stroke, opacity: 0.5 }}
      />
      <span className="font-medium text-sm" style={{ color: colors.text }}>
        {label}
      </span>
    </div>
  );
}

// Main FlowNode component
export function FlowNode({
  type,
  label,
  description,
  isSelected = false,
  width: customWidth,
  height: customHeight,
  style,
  className,
}: FlowNodeProps) {
  const defaultDimensions = FLOW_NODE_DIMENSIONS[type];
  const defaultColors = FLOW_NODE_COLORS[type];

  const width = customWidth ?? defaultDimensions.width;
  const height = customHeight ?? defaultDimensions.height;

  const colors = {
    fill: style?.fill ?? defaultColors.fill,
    stroke: style?.stroke ?? defaultColors.stroke,
    text: defaultColors.text,
  };

  const renderNode = () => {
    switch (type) {
      case 'flow-start':
        return <StartEndNode label={label} isStart={true} colors={colors} width={width} height={height} isSelected={isSelected} />;
      case 'flow-end':
        return <StartEndNode label={label} isStart={false} colors={colors} width={width} height={height} isSelected={isSelected} />;
      case 'flow-decision':
        return <DecisionNode label={label} colors={colors} width={width} height={height} isSelected={isSelected} />;
      case 'flow-process':
        return <ProcessNode label={label} description={description} colors={colors} width={width} height={height} isSelected={isSelected} />;
      case 'flow-screen':
        return <ScreenNode label={label} colors={colors} width={width} height={height} isSelected={isSelected} />;
      case 'flow-data':
        return <DataNode label={label} colors={colors} width={width} height={height} isSelected={isSelected} />;
      case 'flow-subprocess':
        return <SubprocessNode label={label} colors={colors} width={width} height={height} isSelected={isSelected} />;
      default:
        return <ProcessNode label={label} description={description} colors={colors} width={width} height={height} isSelected={isSelected} />;
    }
  };

  return (
    <motion.div
      className={cn('cursor-pointer select-none', className)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {renderNode()}
    </motion.div>
  );
}

// Architecture Nodes
type ArchNodeType =
  | 'arch-service'
  | 'arch-database'
  | 'arch-client'
  | 'arch-api'
  | 'arch-queue'
  | 'arch-cache'
  | 'arch-cdn'
  | 'arch-cloud';

const ARCH_NODE_COLORS: Record<ArchNodeType, { fill: string; stroke: string; text: string }> = {
  'arch-service': { fill: '#3b82f6', stroke: '#2563eb', text: '#ffffff' },
  'arch-database': { fill: '#10b981', stroke: '#059669', text: '#ffffff' },
  'arch-client': { fill: '#8b5cf6', stroke: '#7c3aed', text: '#ffffff' },
  'arch-api': { fill: '#f59e0b', stroke: '#d97706', text: '#000000' },
  'arch-queue': { fill: '#ec4899', stroke: '#db2777', text: '#ffffff' },
  'arch-cache': { fill: '#ef4444', stroke: '#dc2626', text: '#ffffff' },
  'arch-cdn': { fill: '#06b6d4', stroke: '#0891b2', text: '#ffffff' },
  'arch-cloud': { fill: '#1e293b', stroke: '#475569', text: '#ffffff' },
};

interface ArchNodeProps {
  type: ArchNodeType;
  label: string;
  description?: string;
  isSelected?: boolean;
  width?: number;
  height?: number;
  className?: string;
}

// Database cylinder shape
function DatabaseCylinder({
  label,
  description,
  colors,
  width,
  height,
  isSelected,
}: {
  label: string;
  description?: string;
  colors: { fill: string; stroke: string; text: string };
  width: number;
  height: number;
  isSelected: boolean;
}) {
  const ellipseHeight = height * 0.15;

  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center',
        isSelected && 'filter drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]'
      )}
      style={{ width, height }}
    >
      {/* Top ellipse */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{
          height: ellipseHeight * 2,
          backgroundColor: colors.fill,
          borderRadius: '50%',
          border: `2px solid ${colors.stroke}`,
        }}
      />
      {/* Body */}
      <div
        className="absolute left-0 right-0"
        style={{
          top: ellipseHeight,
          bottom: ellipseHeight,
          backgroundColor: colors.fill,
          borderLeft: `2px solid ${colors.stroke}`,
          borderRight: `2px solid ${colors.stroke}`,
        }}
      />
      {/* Bottom ellipse */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: ellipseHeight * 2,
          backgroundColor: colors.fill,
          borderRadius: '50%',
          border: `2px solid ${colors.stroke}`,
        }}
      />
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        <Database className="w-5 h-5 mb-1" style={{ color: colors.text }} />
        <span className="font-medium text-sm" style={{ color: colors.text }}>
          {label}
        </span>
        {description && (
          <span className="text-xs opacity-80" style={{ color: colors.text }}>
            {description}
          </span>
        )}
      </div>
    </div>
  );
}

export function ArchNode({
  type,
  label,
  description,
  isSelected = false,
  width = 140,
  height = 100,
  className,
}: ArchNodeProps) {
  const colors = ARCH_NODE_COLORS[type];

  if (type === 'arch-database') {
    return (
      <motion.div
        className={cn('cursor-pointer select-none', className)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <DatabaseCylinder
          label={label}
          description={description}
          colors={colors}
          width={width}
          height={height}
          isSelected={isSelected}
        />
      </motion.div>
    );
  }

  // Default box style for other arch nodes
  return (
    <motion.div
      className={cn('cursor-pointer select-none', className)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div
        className={cn(
          'flex flex-col items-center justify-center p-4 rounded-xl',
          isSelected && 'ring-2 ring-white ring-offset-2 ring-offset-transparent',
          type === 'arch-cloud' && 'border-dashed'
        )}
        style={{
          width,
          height,
          backgroundColor: colors.fill,
          border: `2px ${type === 'arch-cloud' ? 'dashed' : 'solid'} ${colors.stroke}`,
        }}
      >
        <span className="font-semibold text-sm" style={{ color: colors.text }}>
          {label}
        </span>
        {description && (
          <span className="text-xs mt-1 opacity-80 text-center" style={{ color: colors.text }}>
            {description}
          </span>
        )}
      </div>
    </motion.div>
  );
}

// Export helper to get node icon
export function getFlowNodeIcon(type: FlowNodeType) {
  return FLOW_NODE_ICONS[type];
}

// Export color presets
export { FLOW_NODE_COLORS, ARCH_NODE_COLORS, FLOW_NODE_DIMENSIONS };
