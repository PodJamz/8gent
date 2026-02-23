/**
 * Canvas Schema for AI Collaboration
 *
 * Standardized JSON schema that 8gent can read and write to create
 * UI mockups, user flows, architecture diagrams, and more.
 */

// ============================================================================
// CANVAS TYPES
// ============================================================================

export type CanvasType =
  | 'freeform'       // Free-form creative canvas
  | 'wireframe'      // Low-fi wireframes
  | 'moodboard'      // Visual inspiration boards
  | 'storyboard'     // Sequential story panels
  | 'mindmap'        // Idea mapping
  | 'flowchart'      // Process flows
  | 'ui-mockup'      // Device frames with UI components
  | 'user-flow'      // Navigation and state diagrams
  | 'architecture';  // System architecture diagrams

export const CANVAS_TYPE_LABELS: Record<CanvasType, string> = {
  freeform: 'Freeform',
  wireframe: 'Wireframe',
  moodboard: 'Moodboard',
  storyboard: 'Storyboard',
  mindmap: 'Mind Map',
  flowchart: 'Flowchart',
  'ui-mockup': 'UI Mockup',
  'user-flow': 'User Flow',
  architecture: 'Architecture',
};

// ============================================================================
// NODE TYPES
// ============================================================================

export type BaseNodeType =
  | 'text'
  | 'sticky'
  | 'shape'
  | 'image'
  | 'code'
  | 'frame'
  | 'embed'
  | 'component'
  | 'ai_generation'
  | 'audio'
  | 'video'
  | 'link';

export type DeviceNodeType =
  | 'device-frame'     // iPhone/iPad container
  | 'ios-screen'       // Screen within device
  | 'ios-nav-bar'      // Navigation bar
  | 'ios-tab-bar'      // Tab bar
  | 'ios-button'       // iOS button styles
  | 'ios-card'         // Card component
  | 'ios-list'         // List/table view
  | 'ios-list-item'    // Individual list item
  | 'ios-input'        // Text input field
  | 'ios-segment'      // Segmented control
  | 'ios-toggle'       // Toggle switch
  | 'ios-icon';        // SF Symbol style icon

export type FlowNodeType =
  | 'flow-start'       // Start node (rounded pill)
  | 'flow-end'         // End node (rounded pill)
  | 'flow-decision'    // Diamond decision node
  | 'flow-process'     // Process rectangle
  | 'flow-screen'      // Screen reference
  | 'flow-data'        // Data/storage parallelogram
  | 'flow-subprocess'; // Subprocess (double-bordered rect)

export type ArchNodeType =
  | 'arch-service'     // Microservice box
  | 'arch-database'    // Database cylinder
  | 'arch-client'      // Client device
  | 'arch-api'         // API gateway
  | 'arch-queue'       // Message queue
  | 'arch-cache'       // Cache layer
  | 'arch-cdn'         // CDN node
  | 'arch-cloud';      // Cloud provider boundary

// Production nodes for video/image workflows (processing via server/Lynkr)
export type ProductionNodeType =
  | 'image-input'        // Upload/import image
  | 'image-effect'       // Apply effects (halftone, duotone, etc.)
  | 'image-output'       // Export image
  | 'video-input'        // Upload/import video
  | 'video-effect'       // Apply video effects
  | 'video-timeline'     // Sequence clips
  | 'video-output'       // Export video
  | 'audio-input'        // Upload/import audio
  | 'audio-waveform'     // Visualize audio
  | 'audio-beat-sync'    // Beat detection and sync planning
  | 'storyboard-frame'   // Storyboard panel
  | 'scene-compositor'   // Compose scene from layers
  | 'text-generator'     // Generate text overlays
  | 'ai-generator'       // AI image generation
  | 'color-palette'      // Extract/generate colors
  | 'blend-node'         // Blend/composite images
  | 'export-node';       // Platform-optimized export

export type NodeType = BaseNodeType | DeviceNodeType | FlowNodeType | ArchNodeType | ProductionNodeType;

// ============================================================================
// EDGE TYPES
// ============================================================================

export type EdgeType =
  | 'arrow'           // Standard arrow
  | 'line'            // Simple line
  | 'dashed'          // Dashed line
  | 'orthogonal'      // Right-angle connections
  | 'curved'          // Bezier curve
  | 'bidirectional';  // Two-way arrow

export type EdgeStyle = {
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  markerStart?: 'arrow' | 'circle' | 'diamond' | 'none';
  markerEnd?: 'arrow' | 'circle' | 'diamond' | 'none';
};

// ============================================================================
// NODE SCHEMA
// ============================================================================

export interface NodeStyle {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  cornerRadius?: number;
  shadow?: boolean;
  opacity?: number;
  fontSize?: number;
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
  textAlign?: 'left' | 'center' | 'right';
  padding?: number;
}

export interface NodeMetadata {
  label?: string;
  description?: string;
  linkedProjectId?: string;
  linkedPrdId?: string;
  linkedTicketId?: string;
  linkedCanvasId?: string;
  linkedNodeId?: string;
  icon?: {
    name: string;
    size?: number;
    color?: string;
  };
  status?: 'draft' | 'review' | 'approved' | 'implemented';
}

export interface CanvasNode {
  id: string;
  type: NodeType;
  x: number;
  y: number;
  width: number;
  height: number;
  content: string | StructuredContent;
  style?: NodeStyle;
  metadata?: NodeMetadata;
  children?: string[];  // Child node IDs for containers
  parentId?: string;    // Parent node ID if nested
  locked?: boolean;
  visible?: boolean;
  zIndex?: number;
}

// Structured content for complex nodes
export interface StructuredContent {
  title?: string;
  subtitle?: string;
  body?: string;
  items?: Array<{
    id: string;
    label: string;
    icon?: string;
    badge?: string;
    selected?: boolean;
  }>;
  buttons?: Array<{
    id: string;
    label: string;
    variant?: 'primary' | 'secondary' | 'destructive' | 'ghost';
    icon?: string;
  }>;
  image?: {
    src: string;
    alt?: string;
    fit?: 'cover' | 'contain' | 'fill';
  };
  progress?: {
    value: number;
    max: number;
    label?: string;
  };
}

// ============================================================================
// EDGE SCHEMA
// ============================================================================

export interface CanvasEdge {
  id: string;
  from: string;           // Source node ID
  to: string;             // Target node ID
  fromHandle?: string;    // Specific handle on source
  toHandle?: string;      // Specific handle on target
  type: EdgeType;
  label?: string;
  style?: EdgeStyle;
  animated?: boolean;
  metadata?: {
    condition?: string;   // For decision branches
    action?: string;      // Action description
  };
}

// ============================================================================
// VIEWPORT SCHEMA
// ============================================================================

export interface Viewport {
  x: number;
  y: number;
  zoom: number;
}

// ============================================================================
// FULL CANVAS SCHEMA
// ============================================================================

export interface CanvasData {
  version: '1.0';
  canvasType: CanvasType;
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  viewport: Viewport;
}

export interface CanvasMetadata {
  name: string;
  description?: string;
  projectId?: string;
  prdId?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  tags?: string[];
}

export interface FullCanvasDocument {
  schema: CanvasData;
  metadata: CanvasMetadata;
}

// ============================================================================
// DEVICE PRESETS
// ============================================================================

export const DEVICE_PRESETS = {
  'iphone-15-pro': {
    width: 393,
    height: 852,
    cornerRadius: 55,
    safeAreaTop: 59,
    safeAreaBottom: 34,
    hasDynamicIsland: true,
  },
  'iphone-15': {
    width: 393,
    height: 852,
    cornerRadius: 55,
    safeAreaTop: 59,
    safeAreaBottom: 34,
    hasDynamicIsland: true,
  },
  'iphone-se': {
    width: 375,
    height: 667,
    cornerRadius: 40,
    safeAreaTop: 20,
    safeAreaBottom: 0,
    hasDynamicIsland: false,
  },
  'ipad-pro-11': {
    width: 834,
    height: 1194,
    cornerRadius: 18,
    safeAreaTop: 24,
    safeAreaBottom: 20,
    hasDynamicIsland: false,
  },
} as const;

export type DeviceType = keyof typeof DEVICE_PRESETS;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function createNode(
  type: NodeType,
  x: number,
  y: number,
  content: string | StructuredContent,
  options?: Partial<Omit<CanvasNode, 'id' | 'type' | 'x' | 'y' | 'content'>>
): CanvasNode {
  return {
    id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    x,
    y,
    width: options?.width ?? 200,
    height: options?.height ?? 100,
    content,
    ...options,
  };
}

export function createEdge(
  from: string,
  to: string,
  type: EdgeType = 'arrow',
  options?: Partial<Omit<CanvasEdge, 'id' | 'from' | 'to' | 'type'>>
): CanvasEdge {
  return {
    id: `edge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    from,
    to,
    type,
    ...options,
  };
}

export function createDeviceFrame(
  device: DeviceType,
  x: number,
  y: number,
  screenTitle?: string
): CanvasNode {
  const preset = DEVICE_PRESETS[device];
  return createNode('device-frame', x, y, { title: screenTitle ?? 'Screen' }, {
    width: preset.width,
    height: preset.height,
    style: {
      cornerRadius: preset.cornerRadius,
      fill: '#000000',
      stroke: '#333333',
      strokeWidth: 2,
    },
    metadata: {
      label: device,
    },
  });
}

export function createFlowStart(x: number, y: number, label: string): CanvasNode {
  return createNode('flow-start', x, y, label, {
    width: 120,
    height: 50,
    style: {
      fill: '#10b981',
      cornerRadius: 25,
    },
  });
}

export function createFlowEnd(x: number, y: number, label: string): CanvasNode {
  return createNode('flow-end', x, y, label, {
    width: 120,
    height: 50,
    style: {
      fill: '#ef4444',
      cornerRadius: 25,
    },
  });
}

export function createFlowDecision(x: number, y: number, label: string): CanvasNode {
  return createNode('flow-decision', x, y, label, {
    width: 140,
    height: 100,
    style: {
      fill: '#f59e0b',
    },
  });
}

export function createFlowProcess(x: number, y: number, label: string): CanvasNode {
  return createNode('flow-process', x, y, label, {
    width: 160,
    height: 80,
    style: {
      fill: '#3b82f6',
      cornerRadius: 8,
    },
  });
}

// ============================================================================
// VALIDATION
// ============================================================================

export function validateCanvasData(data: unknown): data is CanvasData {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;

  if (d.version !== '1.0') return false;
  if (!Array.isArray(d.nodes)) return false;
  if (!Array.isArray(d.edges)) return false;
  if (!d.viewport || typeof d.viewport !== 'object') return false;

  return true;
}

export function parseCanvasData(json: string): CanvasData | null {
  try {
    const data = JSON.parse(json);
    if (validateCanvasData(data)) {
      return data;
    }
    // Handle legacy format (nodes, edges, viewport without version)
    if (Array.isArray(data.nodes) && Array.isArray(data.edges)) {
      return {
        version: '1.0',
        canvasType: 'freeform',
        nodes: data.nodes,
        edges: data.edges,
        viewport: data.viewport ?? { x: 0, y: 0, zoom: 1 },
      };
    }
    return null;
  } catch {
    return null;
  }
}

export function serializeCanvasData(data: CanvasData): string {
  return JSON.stringify(data);
}

// ============================================================================
// MUSIC GENERATION NODE HELPERS
// ============================================================================

export interface MusicGenerationNodeContent extends StructuredContent {
  musicConfig: {
    prompt: string;
    lyrics?: string;
    duration: number;
    bpm?: number;
    key?: string;
    timeSignature?: string;
  };
  result?: {
    audioUrl: string;
    actualBpm: number;
    actualKey: string;
    actualDuration: number;
  };
  status: 'idle' | 'generating' | 'completed' | 'failed';
  error?: string;
}

/**
 * Create a music generation node for the canvas
 */
export function createMusicGenerationNode(
  x: number,
  y: number,
  config: {
    prompt: string;
    lyrics?: string;
    duration?: number;
    bpm?: number;
    key?: string;
    timeSignature?: string;
    title?: string;
  }
): CanvasNode {
  const content: MusicGenerationNodeContent = {
    title: config.title || 'AI Music',
    musicConfig: {
      prompt: config.prompt,
      lyrics: config.lyrics,
      duration: config.duration || 30,
      bpm: config.bpm,
      key: config.key,
      timeSignature: config.timeSignature || '4/4',
    },
    status: 'idle',
  };

  return createNode('ai_generation', x, y, content, {
    width: 320,
    height: 200,
    style: {
      fill: '#1a1a2e',
      stroke: '#8B5CF6',
      strokeWidth: 2,
      cornerRadius: 12,
    },
    metadata: {
      label: 'Music Generation',
      icon: {
        name: 'music',
        size: 20,
        color: '#8B5CF6',
      },
    },
  });
}

/**
 * Create an audio playback node (for displaying generated music)
 */
export function createAudioNode(
  x: number,
  y: number,
  audioUrl: string,
  title?: string,
  metadata?: {
    bpm?: number;
    key?: string;
    duration?: number;
  }
): CanvasNode {
  const content: StructuredContent = {
    title: title || 'Audio',
    subtitle: metadata
      ? `${metadata.bpm || '?'} BPM | ${metadata.key || '?'} | ${metadata.duration || '?'}s`
      : undefined,
    image: {
      src: audioUrl,
      alt: 'audio',
    },
  };

  return createNode('audio', x, y, content, {
    width: 280,
    height: 120,
    style: {
      fill: '#1a1a2e',
      stroke: '#10b981',
      strokeWidth: 2,
      cornerRadius: 8,
    },
    metadata: {
      label: title || 'Audio',
      icon: {
        name: 'volume-2',
        size: 16,
        color: '#10b981',
      },
    },
  });
}
