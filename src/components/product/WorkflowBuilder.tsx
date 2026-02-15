'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  User,
  Bot,
  CheckCircle,
  GitBranch,
  Play,
  Square,
  Trash2,
  GripVertical,
  Save,
  Download,
  Zap,
  ArrowRight,
  Undo,
  Redo,
  PanelLeftOpen,
  PanelLeftClose,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

type NodeType = 'start' | 'end' | 'human' | 'ai' | 'approval' | 'conditional';

interface WorkflowNode {
  id: string;
  type: NodeType;
  title: string;
  description: string;
  x: number;
  y: number;
  config?: Record<string, unknown>;
}

interface Connection {
  id: string;
  from: string;
  to: string;
  label?: string;
}

interface WorkflowData {
  nodes: WorkflowNode[];
  connections: Connection[];
  name: string;
  description: string;
}

// ============================================================================
// Node Type Configuration (No purples - warm/cool palette)
// ============================================================================

const NODE_TYPES: Record<NodeType, { icon: React.ReactNode; label: string; bgClass: string; description: string }> = {
  start: {
    icon: <Play className="w-4 h-4" />,
    label: 'Start',
    bgClass: 'bg-emerald-500',
    description: 'Workflow entry point',
  },
  end: {
    icon: <Square className="w-4 h-4" />,
    label: 'End',
    bgClass: 'bg-rose-500',
    description: 'Workflow completion',
  },
  human: {
    icon: <User className="w-4 h-4" />,
    label: 'Human Action',
    bgClass: 'bg-blue-500',
    description: 'Requires human input',
  },
  ai: {
    icon: <Bot className="w-4 h-4" />,
    label: 'AI Action',
    bgClass: 'bg-amber-500',
    description: 'Automated AI step',
  },
  approval: {
    icon: <CheckCircle className="w-4 h-4" />,
    label: 'Approval',
    bgClass: 'bg-orange-500',
    description: 'Requires approval',
  },
  conditional: {
    icon: <GitBranch className="w-4 h-4" />,
    label: 'Conditional',
    bgClass: 'bg-cyan-500',
    description: 'Branch on condition',
  },
};

// ============================================================================
// Node Component
// ============================================================================

interface NodeComponentProps {
  node: WorkflowNode;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onUpdate: (updates: Partial<WorkflowNode>) => void;
  onStartConnection: () => void;
  isConnecting: boolean;
  onCompleteConnection: () => void;
}

function NodeComponent({
  node,
  isSelected,
  onSelect,
  onDelete,
  onUpdate,
  onStartConnection,
  isConnecting,
  onCompleteConnection,
}: NodeComponentProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const nodeStartPos = useRef({ x: 0, y: 0 });

  const nodeConfig = NODE_TYPES[node.type];

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    e.stopPropagation();

    if (isConnecting) {
      onCompleteConnection();
      return;
    }

    onSelect();
    setIsDragging(true);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    nodeStartPos.current = { x: node.x, y: node.y };
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - dragStartPos.current.x;
      const dy = e.clientY - dragStartPos.current.y;
      onUpdate({
        x: Math.max(0, nodeStartPos.current.x + dx),
        y: Math.max(0, nodeStartPos.current.y + dy),
      });
    };

    const handleMouseUp = () => setIsDragging(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, onUpdate]);

  return (
    <motion.div
      ref={nodeRef}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={cn(
        'absolute w-44 rounded-xl border backdrop-blur-xl cursor-move select-none',
        'transition-all duration-200',
        isSelected
          ? 'border-[hsl(var(--theme-primary))] shadow-lg z-20'
          : 'border-[hsl(var(--theme-border))] hover:border-[hsl(var(--theme-primary)/0.5)] z-10',
        isConnecting && 'ring-2 ring-[hsl(var(--theme-primary)/0.5)] cursor-pointer'
      )}
      style={{
        left: node.x,
        top: node.y,
        backgroundColor: 'hsl(var(--theme-card))',
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Header */}
      <div className={cn('flex items-center gap-2 p-2.5 rounded-t-xl', nodeConfig.bgClass)}>
        <GripVertical className="w-3.5 h-3.5 text-white/60" />
        <div className="flex-1 flex items-center gap-1.5">
          {nodeConfig.icon}
          <span className="text-xs font-medium text-white">{nodeConfig.label}</span>
        </div>
        {node.type !== 'start' && node.type !== 'end' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-0.5 rounded hover:bg-white/20 transition-colors"
          >
            <Trash2 className="w-3 h-3 text-white/60" />
          </button>
        )}
      </div>

      {/* Body */}
      <div className="p-2.5 space-y-1">
        {isEditing ? (
          <input
            type="text"
            value={node.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            onBlur={() => setIsEditing(false)}
            onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
            autoFocus
            className={cn(
              'w-full px-2 py-1 text-xs rounded',
              'bg-[hsl(var(--theme-muted))] border border-[hsl(var(--theme-border))]',
              'text-[hsl(var(--theme-foreground))]',
              'focus:outline-none focus:border-[hsl(var(--theme-primary))]'
            )}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <p
            className="text-xs font-medium text-[hsl(var(--theme-foreground))] cursor-text"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
          >
            {node.title || 'Click to edit...'}
          </p>
        )}
        <p className="text-[10px] text-[hsl(var(--theme-muted-foreground))]">
          {node.description || nodeConfig.description}
        </p>
      </div>

      {/* Output Connection Point */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onStartConnection();
        }}
        className={cn(
          'absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full',
          'border-2 border-[hsl(var(--theme-border))]',
          'bg-[hsl(var(--theme-card))]',
          'hover:bg-[hsl(var(--theme-primary))] hover:border-[hsl(var(--theme-primary))] transition-colors'
        )}
      />

      {/* Input Connection Point */}
      <div
        className={cn(
          'absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full',
          'border-2 border-[hsl(var(--theme-border))]',
          'bg-[hsl(var(--theme-card))]'
        )}
      />
    </motion.div>
  );
}

// ============================================================================
// Connection Line
// ============================================================================

function ConnectionLine({ from, to, isTemp }: { from: { x: number; y: number }; to: { x: number; y: number }; isTemp?: boolean }) {
  const dx = Math.abs(to.x - from.x);
  const controlOffset = Math.min(dx * 0.5, 80);
  const path = `M ${from.x} ${from.y} C ${from.x + controlOffset} ${from.y}, ${to.x - controlOffset} ${to.y}, ${to.x} ${to.y}`;

  return (
    <svg className="absolute inset-0 pointer-events-none z-0" style={{ overflow: 'visible' }}>
      <path
        d={path}
        fill="none"
        stroke={isTemp ? 'hsl(var(--theme-primary) / 0.5)' : 'hsl(var(--theme-border))'}
        strokeWidth={2}
        strokeDasharray={isTemp ? '4,4' : undefined}
      />
      {!isTemp && <circle cx={to.x} cy={to.y} r={3} fill="hsl(var(--theme-primary))" />}
    </svg>
  );
}

// ============================================================================
// Sidebar
// ============================================================================

interface SidebarProps {
  onAddNode: (type: NodeType) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

function Sidebar({ onAddNode, isOpen, onClose }: SidebarProps) {
  const availableTypes: NodeType[] = ['human', 'ai', 'approval', 'conditional'];

  const content = (
    <>
      <div>
        <h3
          className="text-xs font-semibold text-[hsl(var(--theme-muted-foreground))] uppercase tracking-wider mb-3"
        >
          Add Nodes
        </h3>
        <div className="space-y-2">
          {availableTypes.map((type) => {
            const config = NODE_TYPES[type];
            return (
              <button
                key={type}
                onClick={() => {
                  onAddNode(type);
                  onClose?.();
                }}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left',
                  'border border-[hsl(var(--theme-border))]',
                  'hover:border-[hsl(var(--theme-primary)/0.5)] hover:bg-[hsl(var(--theme-muted))]',
                  'transition-colors'
                )}
                style={{ backgroundColor: 'hsl(var(--theme-background))' }}
              >
                <div className={cn('p-1.5 rounded-md', config.bgClass)}>
                  {config.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[hsl(var(--theme-foreground))]">{config.label}</p>
                  <p className="text-[10px] text-[hsl(var(--theme-muted-foreground))] truncate">{config.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-4 border-t border-[hsl(var(--theme-border))]">
        <h3 className="text-xs font-semibold text-[hsl(var(--theme-muted-foreground))] uppercase tracking-wider mb-3">
          Legend
        </h3>
        <div className="space-y-2 text-[10px] text-[hsl(var(--theme-muted-foreground))]">
          <p className="flex items-center gap-2">
            <User className="w-3 h-3" /> Human intervenes
          </p>
          <p className="flex items-center gap-2">
            <Bot className="w-3 h-3" /> AI acts autonomously
          </p>
          <p className="flex items-center gap-2">
            <CheckCircle className="w-3 h-3" /> Approval required
          </p>
          <p className="flex items-center gap-2">
            <GitBranch className="w-3 h-3" /> Conditional branch
          </p>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className="hidden md:block w-56 flex-shrink-0 border-r border-[hsl(var(--theme-border))] p-4 space-y-4"
        style={{ backgroundColor: 'hsl(var(--theme-card))' }}
      >
        {content}
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="md:hidden fixed inset-0 bg-black/50 z-40"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="md:hidden fixed left-0 top-0 bottom-0 w-72 z-50 p-4 space-y-4 overflow-y-auto"
              style={{ backgroundColor: 'hsl(var(--theme-card))' }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-[hsl(var(--theme-foreground))]">
                  Add Nodes
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-[hsl(var(--theme-muted))] transition-colors"
                >
                  <X className="w-5 h-5 text-[hsl(var(--theme-muted-foreground))]" />
                </button>
              </div>
              {content}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ============================================================================
// Main Workflow Builder
// ============================================================================

interface WorkflowBuilderProps {
  initialData?: WorkflowData;
  onSave?: (data: WorkflowData) => void;
}

export function WorkflowBuilder({ initialData, onSave }: WorkflowBuilderProps) {
  const [nodes, setNodes] = useState<WorkflowNode[]>(
    initialData?.nodes || [
      { id: 'start', type: 'start', title: 'Start', description: 'Workflow begins', x: 50, y: 150 },
      { id: 'end', type: 'end', title: 'End', description: 'Workflow completes', x: 500, y: 150 },
    ]
  );
  const [connections, setConnections] = useState<Connection[]>(initialData?.connections || []);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [workflowName, setWorkflowName] = useState(initialData?.name || 'Untitled Workflow');
  const [workflowDescription, setWorkflowDescription] = useState(initialData?.description || '');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const generateId = () => `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const addNode = useCallback((type: NodeType) => {
    const newNode: WorkflowNode = {
      id: generateId(),
      type,
      title: NODE_TYPES[type].label,
      description: '',
      x: 250 + Math.random() * 100,
      y: 100 + Math.random() * 100,
    };
    setNodes((prev) => [...prev, newNode]);
    setSelectedNode(newNode.id);
  }, []);

  const updateNode = useCallback((id: string, updates: Partial<WorkflowNode>) => {
    setNodes((prev) => prev.map((node) => (node.id === id ? { ...node, ...updates } : node)));
  }, []);

  const deleteNode = useCallback((id: string) => {
    if (id === 'start' || id === 'end') return;
    setNodes((prev) => prev.filter((node) => node.id !== id));
    setConnections((prev) => prev.filter((conn) => conn.from !== id && conn.to !== id));
    if (selectedNode === id) setSelectedNode(null);
  }, [selectedNode]);

  const startConnection = useCallback((fromId: string) => setConnectingFrom(fromId), []);

  const completeConnection = useCallback((toId: string) => {
    if (!connectingFrom || connectingFrom === toId) {
      setConnectingFrom(null);
      return;
    }
    const exists = connections.some((c) => c.from === connectingFrom && c.to === toId);
    if (!exists) {
      setConnections((prev) => [...prev, { id: generateId(), from: connectingFrom, to: toId }]);
    }
    setConnectingFrom(null);
  }, [connectingFrom, connections]);

  useEffect(() => {
    if (!connectingFrom) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [connectingFrom]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setConnectingFrom(null);
        setSelectedNode(null);
      }
      if (e.key === 'Delete' && selectedNode) deleteNode(selectedNode);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNode, deleteNode]);

  const getNodeConnectionPoint = (nodeId: string, isOutput: boolean) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return { x: 0, y: 0 };
    return { x: isOutput ? node.x + 176 : node.x, y: node.y + 40 };
  };

  const handleSave = () => {
    const data: WorkflowData = { nodes, connections, name: workflowName, description: workflowDescription };
    onSave?.(data);
    localStorage.setItem('workflow_draft', JSON.stringify(data));
  };

  const handleExport = () => {
    const data: WorkflowData = { nodes, connections, name: workflowName, description: workflowDescription };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workflowName.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-full" style={{ backgroundColor: 'hsl(var(--theme-background))' }}>
      {/* Sidebar */}
      <Sidebar onAddNode={addNode} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div
          className="flex-shrink-0 p-3 sm:p-4 border-b border-[hsl(var(--theme-border))]"
          style={{ backgroundColor: 'hsl(var(--theme-card))' }}
        >
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Mobile sidebar toggle */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className={cn(
                'md:hidden p-2 rounded-lg',
                'hover:bg-[hsl(var(--theme-muted))] transition-colors'
              )}
            >
              <PanelLeftOpen className="w-5 h-5 text-[hsl(var(--theme-foreground))]" />
            </button>

            <div className="flex-1 min-w-0">
              <input
                type="text"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                className={cn(
                  'text-base sm:text-lg font-semibold bg-transparent border-none outline-none w-full',
                  'text-[hsl(var(--theme-foreground))] placeholder-[hsl(var(--theme-muted-foreground))]'
                )}
                style={{ fontFamily: 'var(--theme-font-heading)' }}
                placeholder="Workflow name..."
              />
              <input
                type="text"
                value={workflowDescription}
                onChange={(e) => setWorkflowDescription(e.target.value)}
                className={cn(
                  'text-xs sm:text-sm bg-transparent border-none outline-none w-full mt-0.5',
                  'text-[hsl(var(--theme-muted-foreground))] placeholder-[hsl(var(--theme-muted-foreground))]'
                )}
                placeholder="Add a description..."
              />
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={handleSave}
                className={cn(
                  'flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium',
                  'bg-[hsl(var(--theme-primary))] text-[hsl(var(--theme-primary-foreground))]',
                  'hover:bg-[hsl(var(--theme-primary)/0.9)] transition-colors'
                )}
              >
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">Save</span>
              </button>
              <button
                onClick={handleExport}
                className={cn(
                  'flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium',
                  'bg-[hsl(var(--theme-muted))] text-[hsl(var(--theme-foreground))]',
                  'hover:bg-[hsl(var(--theme-muted)/0.8)] transition-colors'
                )}
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div
          ref={canvasRef}
          className="flex-1 relative overflow-auto"
          style={{
            backgroundColor: 'hsl(var(--theme-background))',
            backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(var(--theme-border) / 0.3) 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
          onClick={() => {
            setSelectedNode(null);
            if (connectingFrom) setConnectingFrom(null);
          }}
        >
          {connections.map((conn) => (
            <ConnectionLine
              key={conn.id}
              from={getNodeConnectionPoint(conn.from, true)}
              to={getNodeConnectionPoint(conn.to, false)}
            />
          ))}

          {connectingFrom && (
            <ConnectionLine from={getNodeConnectionPoint(connectingFrom, true)} to={mousePos} isTemp />
          )}

          <AnimatePresence>
            {nodes.map((node) => (
              <NodeComponent
                key={node.id}
                node={node}
                isSelected={selectedNode === node.id}
                onSelect={() => setSelectedNode(node.id)}
                onDelete={() => deleteNode(node.id)}
                onUpdate={(updates) => updateNode(node.id, updates)}
                onStartConnection={() => startConnection(node.id)}
                isConnecting={connectingFrom !== null && connectingFrom !== node.id}
                onCompleteConnection={() => completeConnection(node.id)}
              />
            ))}
          </AnimatePresence>

          {nodes.length <= 2 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center text-[hsl(var(--theme-muted-foreground))]">
                <Zap className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm font-medium">Build your workflow</p>
                <p className="text-xs mt-1 opacity-60">Add nodes from the sidebar and connect them</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div
          className="flex-shrink-0 px-4 py-2 border-t border-[hsl(var(--theme-border))] text-center"
          style={{ backgroundColor: 'hsl(var(--theme-card))' }}
        >
          <p className="text-[10px] text-[hsl(var(--theme-muted-foreground))]">
            Drag to position · Click arrow to connect · Delete to remove · Escape to cancel
          </p>
        </div>
      </div>
    </div>
  );
}
