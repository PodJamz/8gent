/**
 * 8gent Canvas Tools - Allows AI to control the design canvas
 *
 * Tools for:
 * - Moving nodes by grid position
 * - Editing node content and colors
 * - Creating new nodes
 * - Creating mindmap branches
 * - Describing canvas state
 */

import {
  pixelToGrid,
  gridToPixel,
  describeCanvas,
  getRelativePosition,
  getColorHex,
  NODE_COLORS,
  type CanvasNode,
  type CanvasEdge,
  type GridPosition,
  type Direction,
} from '@/lib/canvas/grid-system';

// ============================================================================
// Tool Definitions (for AI system prompt)
// ============================================================================

export const CANVAS_TOOL_DEFINITIONS = [
  {
    name: 'describe_canvas',
    description: 'Get a complete description of the current canvas state including all nodes, their positions on the grid, contents, colors, and connections. Use this to understand what is on the canvas before making changes.',
    parameters: {},
  },
  {
    name: 'move_node',
    description: 'Move a node to a new position on the canvas grid. Positions use spreadsheet-style notation (A1, B2, C3, etc.) where letters are columns and numbers are rows.',
    parameters: {
      nodeId: { type: 'string', description: 'The ID of the node to move' },
      toPosition: { type: 'string', description: 'Target grid position (e.g., "B5", "C10", "AA3")' },
    },
  },
  {
    name: 'update_node_content',
    description: 'Update the text content of a node',
    parameters: {
      nodeId: { type: 'string', description: 'The ID of the node to update' },
      content: { type: 'string', description: 'New text content for the node' },
    },
  },
  {
    name: 'update_node_color',
    description: `Change the color of a node. Available colors: ${Object.keys(NODE_COLORS).join(', ')}`,
    parameters: {
      nodeId: { type: 'string', description: 'The ID of the node to update' },
      color: { type: 'string', description: 'Color name (yellow, blue, green, pink, purple, orange, red, cyan, white, gray)' },
    },
  },
  {
    name: 'create_node',
    description: 'Create a new node on the canvas at a specific grid position',
    parameters: {
      type: { type: 'string', description: 'Node type: sticky, text, shape, code, mindmap' },
      position: { type: 'string', description: 'Grid position (e.g., "B5")' },
      content: { type: 'string', description: 'Text content for the node' },
      color: { type: 'string', description: 'Optional color name', optional: true },
    },
  },
  {
    name: 'connect_nodes',
    description: 'Create a connection/edge between two nodes',
    parameters: {
      fromNodeId: { type: 'string', description: 'Source node ID' },
      toNodeId: { type: 'string', description: 'Target node ID' },
      label: { type: 'string', description: 'Optional label for the connection', optional: true },
    },
  },
  {
    name: 'delete_node',
    description: 'Delete a node from the canvas',
    parameters: {
      nodeId: { type: 'string', description: 'The ID of the node to delete' },
    },
  },
  {
    name: 'create_mindmap_branch',
    description: 'Add a new branch to a mindmap. Creates a new node connected to the parent node, positioned in the specified direction.',
    parameters: {
      parentNodeId: { type: 'string', description: 'The ID of the parent node to branch from' },
      content: { type: 'string', description: 'Text content for the new branch' },
      direction: { type: 'string', description: 'Direction: above, below, left, right, above-left, above-right, below-left, below-right' },
      color: { type: 'string', description: 'Optional color name', optional: true },
    },
  },
  {
    name: 'arrange_nodes',
    description: 'Automatically arrange selected nodes in a pattern',
    parameters: {
      nodeIds: { type: 'array', description: 'Array of node IDs to arrange' },
      pattern: { type: 'string', description: 'Arrangement pattern: grid, horizontal, vertical, radial, mindmap' },
      startPosition: { type: 'string', description: 'Starting grid position (e.g., "B5")' },
    },
  },
];

// ============================================================================
// Tool Execution Results
// ============================================================================

export interface CanvasToolResult {
  success: boolean;
  message: string;
  data?: unknown;
}

// ============================================================================
// Canvas Tool Executor
// ============================================================================

export interface CanvasState {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  viewport: { x: number; y: number; zoom: number };
}

export interface CanvasToolExecutorOptions {
  getCanvasState: () => CanvasState;
  setCanvasState: (state: CanvasState) => void;
}

export class CanvasToolExecutor {
  private getState: () => CanvasState;
  private setState: (state: CanvasState) => void;

  constructor(options: CanvasToolExecutorOptions) {
    this.getState = options.getCanvasState;
    this.setState = options.setCanvasState;
  }

  /**
   * Execute a canvas tool by name
   */
  async execute(
    toolName: string,
    params: Record<string, unknown>
  ): Promise<CanvasToolResult> {
    switch (toolName) {
      case 'describe_canvas':
        return this.describeCanvas();
      case 'move_node':
        return this.moveNode(params.nodeId as string, params.toPosition as string);
      case 'update_node_content':
        return this.updateNodeContent(params.nodeId as string, params.content as string);
      case 'update_node_color':
        return this.updateNodeColor(params.nodeId as string, params.color as string);
      case 'create_node':
        return this.createNode(
          params.type as string,
          params.position as string,
          params.content as string,
          params.color as string | undefined
        );
      case 'connect_nodes':
        return this.connectNodes(
          params.fromNodeId as string,
          params.toNodeId as string,
          params.label as string | undefined
        );
      case 'delete_node':
        return this.deleteNode(params.nodeId as string);
      case 'create_mindmap_branch':
        return this.createMindmapBranch(
          params.parentNodeId as string,
          params.content as string,
          params.direction as Direction,
          params.color as string | undefined
        );
      case 'arrange_nodes':
        return this.arrangeNodes(
          params.nodeIds as string[],
          params.pattern as string,
          params.startPosition as string
        );
      default:
        return { success: false, message: `Unknown canvas tool: ${toolName}` };
    }
  }

  /**
   * Describe the current canvas state
   */
  private describeCanvas(): CanvasToolResult {
    const state = this.getState();
    const description = describeCanvas(state.nodes, state.edges);

    return {
      success: true,
      message: description.spatialLayout,
      data: description,
    };
  }

  /**
   * Move a node to a grid position
   */
  private moveNode(nodeId: string, toPosition: string): CanvasToolResult {
    const state = this.getState();
    const nodeIndex = state.nodes.findIndex((n) => n.id === nodeId);

    if (nodeIndex === -1) {
      return { success: false, message: `Node not found: ${nodeId}` };
    }

    try {
      const pixel = gridToPixel(toPosition);
      const newNodes = [...state.nodes];
      newNodes[nodeIndex] = {
        ...newNodes[nodeIndex],
        x: pixel.x,
        y: pixel.y,
      };

      this.setState({ ...state, nodes: newNodes });

      return {
        success: true,
        message: `Moved node ${nodeId} to position ${toPosition}`,
        data: { nodeId, newPosition: toPosition, pixel },
      };
    } catch (error) {
      return { success: false, message: `Invalid position: ${toPosition}` };
    }
  }

  /**
   * Update node content
   */
  private updateNodeContent(nodeId: string, content: string): CanvasToolResult {
    const state = this.getState();
    const nodeIndex = state.nodes.findIndex((n) => n.id === nodeId);

    if (nodeIndex === -1) {
      return { success: false, message: `Node not found: ${nodeId}` };
    }

    const newNodes = [...state.nodes];
    newNodes[nodeIndex] = {
      ...newNodes[nodeIndex],
      content,
    };

    this.setState({ ...state, nodes: newNodes });

    return {
      success: true,
      message: `Updated content of node ${nodeId}`,
      data: { nodeId, content },
    };
  }

  /**
   * Update node color
   */
  private updateNodeColor(nodeId: string, color: string): CanvasToolResult {
    const state = this.getState();
    const nodeIndex = state.nodes.findIndex((n) => n.id === nodeId);

    if (nodeIndex === -1) {
      return { success: false, message: `Node not found: ${nodeId}` };
    }

    const hex = getColorHex(color);
    const newNodes = [...state.nodes];
    newNodes[nodeIndex] = {
      ...newNodes[nodeIndex],
      style: { ...newNodes[nodeIndex].style, fill: hex },
    };

    this.setState({ ...state, nodes: newNodes });

    return {
      success: true,
      message: `Changed color of node ${nodeId} to ${color}`,
      data: { nodeId, color, hex },
    };
  }

  /**
   * Create a new node
   */
  private createNode(
    type: string,
    position: string,
    content: string,
    color?: string
  ): CanvasToolResult {
    const state = this.getState();

    try {
      const pixel = gridToPixel(position);
      const nodeId = `node-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

      const newNode: CanvasNode = {
        id: nodeId,
        type: type === 'mindmap' ? 'sticky' : type,
        content,
        x: pixel.x,
        y: pixel.y,
        width: type === 'text' ? 200 : 150,
        height: type === 'text' ? 50 : 100,
        style: color ? { fill: getColorHex(color) } : undefined,
      };

      this.setState({
        ...state,
        nodes: [...state.nodes, newNode],
      });

      return {
        success: true,
        message: `Created ${type} node at ${position} with content: "${content}"`,
        data: { nodeId, position, pixel },
      };
    } catch (error) {
      return { success: false, message: `Invalid position: ${position}` };
    }
  }

  /**
   * Connect two nodes
   */
  private connectNodes(
    fromNodeId: string,
    toNodeId: string,
    label?: string
  ): CanvasToolResult {
    const state = this.getState();

    const fromNode = state.nodes.find((n) => n.id === fromNodeId);
    const toNode = state.nodes.find((n) => n.id === toNodeId);

    if (!fromNode) {
      return { success: false, message: `Source node not found: ${fromNodeId}` };
    }
    if (!toNode) {
      return { success: false, message: `Target node not found: ${toNodeId}` };
    }

    const edgeId = `edge-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newEdge: CanvasEdge = {
      id: edgeId,
      source: fromNodeId,
      target: toNodeId,
      label,
    };

    this.setState({
      ...state,
      edges: [...state.edges, newEdge],
    });

    return {
      success: true,
      message: `Connected ${fromNodeId} to ${toNodeId}${label ? ` with label "${label}"` : ''}`,
      data: { edgeId, fromNodeId, toNodeId },
    };
  }

  /**
   * Delete a node
   */
  private deleteNode(nodeId: string): CanvasToolResult {
    const state = this.getState();
    const nodeIndex = state.nodes.findIndex((n) => n.id === nodeId);

    if (nodeIndex === -1) {
      return { success: false, message: `Node not found: ${nodeId}` };
    }

    // Remove node and all connected edges
    const newNodes = state.nodes.filter((n) => n.id !== nodeId);
    const newEdges = state.edges.filter(
      (e) => e.source !== nodeId && e.target !== nodeId
    );

    this.setState({ ...state, nodes: newNodes, edges: newEdges });

    return {
      success: true,
      message: `Deleted node ${nodeId}`,
      data: { nodeId },
    };
  }

  /**
   * Create a mindmap branch
   */
  private createMindmapBranch(
    parentNodeId: string,
    content: string,
    direction: Direction,
    color?: string
  ): CanvasToolResult {
    const state = this.getState();
    const parentNode = state.nodes.find((n) => n.id === parentNodeId);

    if (!parentNode) {
      return { success: false, message: `Parent node not found: ${parentNodeId}` };
    }

    // Get parent position and calculate new position
    const parentGrid = pixelToGrid({ x: parentNode.x, y: parentNode.y });
    const newPosition = getRelativePosition(parentGrid.label, direction, 2);

    // Create the new node
    const createResult = this.createNode('mindmap', newPosition, content, color);
    if (!createResult.success) return createResult;

    // Connect to parent
    const newNodeId = (createResult.data as { nodeId: string }).nodeId;
    const connectResult = this.connectNodes(parentNodeId, newNodeId);

    return {
      success: true,
      message: `Created mindmap branch "${content}" ${direction} of parent at ${newPosition}`,
      data: {
        nodeId: newNodeId,
        parentNodeId,
        position: newPosition,
        direction,
      },
    };
  }

  /**
   * Arrange nodes in a pattern
   */
  private arrangeNodes(
    nodeIds: string[],
    pattern: string,
    startPosition: string
  ): CanvasToolResult {
    const state = this.getState();

    // Verify all nodes exist
    for (const id of nodeIds) {
      if (!state.nodes.find((n) => n.id === id)) {
        return { success: false, message: `Node not found: ${id}` };
      }
    }

    try {
      const startPixel = gridToPixel(startPosition);
      const newNodes = [...state.nodes];
      const spacing = 200; // pixels between nodes

      nodeIds.forEach((id, index) => {
        const nodeIndex = newNodes.findIndex((n) => n.id === id);
        if (nodeIndex === -1) return;

        let x = startPixel.x;
        let y = startPixel.y;

        switch (pattern) {
          case 'horizontal':
            x += index * spacing;
            break;
          case 'vertical':
            y += index * spacing;
            break;
          case 'grid':
            const cols = Math.ceil(Math.sqrt(nodeIds.length));
            x += (index % cols) * spacing;
            y += Math.floor(index / cols) * spacing;
            break;
          case 'radial':
            const angle = (index / nodeIds.length) * 2 * Math.PI;
            const radius = 200;
            x += Math.cos(angle) * radius;
            y += Math.sin(angle) * radius;
            break;
          case 'mindmap':
            // First node is center, others radiate out
            if (index === 0) {
              // Center node stays at start
            } else {
              const branchAngle = ((index - 1) / (nodeIds.length - 1)) * 2 * Math.PI;
              x += Math.cos(branchAngle) * spacing;
              y += Math.sin(branchAngle) * spacing;
            }
            break;
        }

        newNodes[nodeIndex] = { ...newNodes[nodeIndex], x, y };
      });

      this.setState({ ...state, nodes: newNodes });

      return {
        success: true,
        message: `Arranged ${nodeIds.length} nodes in ${pattern} pattern starting at ${startPosition}`,
        data: { nodeIds, pattern, startPosition },
      };
    } catch (error) {
      return { success: false, message: `Invalid start position: ${startPosition}` };
    }
  }
}

// ============================================================================
// Canvas Context for AI System Prompt
// ============================================================================

/**
 * Generate canvas context for 8gent system prompt
 */
export function generateCanvasContext(state: CanvasState): string {
  const description = describeCanvas(state.nodes, state.edges);

  return `
## Current Canvas State

You have access to a design canvas that you can control using tools.

**Canvas Grid System:**
- Positions use spreadsheet notation: columns are letters (A-Z, AA-AZ, etc.), rows are numbers (1-100)
- Example: A1 is top-left, B5 is column B row 5, AA10 is column 27 row 10
- Each grid cell is 100x100 pixels

**Current State:**
- Total nodes: ${description.totalNodes}
- Total connections: ${description.totalConnections}
- Grid bounds: ${description.gridBounds.minLabel} to ${description.gridBounds.maxLabel}

**Nodes on Canvas:**
${description.nodes.length > 0 ? description.nodes.map((n) => `- [${n.id}] ${n.type} at ${n.gridPosition}: "${n.content.slice(0, 40)}${n.content.length > 40 ? '...' : ''}"${n.color ? ` (${n.color})` : ''}`).join('\n') : '(empty)'}

**Available Canvas Tools:**
- describe_canvas: Get full canvas state
- move_node: Move a node to grid position
- update_node_content: Change node text
- update_node_color: Change node color (yellow, blue, green, pink, purple, orange, red, cyan, white, gray)
- create_node: Add new node (sticky, text, shape, code, mindmap)
- connect_nodes: Create connection between nodes
- delete_node: Remove a node
- create_mindmap_branch: Add branch to mindmap (specify direction: above, below, left, right, etc.)
- arrange_nodes: Auto-arrange nodes (grid, horizontal, vertical, radial, mindmap)

When the user asks you to manipulate the canvas, use these tools. You can visualize the grid in your head - it's like a spreadsheet!
`;
}
