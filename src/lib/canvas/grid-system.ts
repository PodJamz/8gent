/**
 * Canvas Grid System - Provides coordinate-based spatial awareness for 8gent
 *
 * Converts pixel positions to grid coordinates (like A1, B2, C3 or row,col)
 * Allows AI to understand and manipulate canvas through a matrix system
 */

// Grid configuration
export const GRID_CONFIG = {
  CELL_SIZE: 100, // Each grid cell is 100x100 pixels
  GRID_COLS: 100, // 100 columns (A-CV in letter notation, or 0-99)
  GRID_ROWS: 100, // 100 rows (1-100)
  CANVAS_WIDTH: 10000,
  CANVAS_HEIGHT: 10000,
  OFFSET: 5000, // Canvas uses 5000px offset for centering
};

// ============================================================================
// Coordinate Conversion
// ============================================================================

export interface GridPosition {
  row: number; // 0-based row index
  col: number; // 0-based column index
  label: string; // Human-readable label like "A1", "B5", "AA23"
}

export interface PixelPosition {
  x: number;
  y: number;
}

/**
 * Convert column number to letter (0=A, 1=B, ..., 25=Z, 26=AA, etc.)
 */
export function colToLetter(col: number): string {
  let result = '';
  let c = col;
  while (c >= 0) {
    result = String.fromCharCode((c % 26) + 65) + result;
    c = Math.floor(c / 26) - 1;
  }
  return result;
}

/**
 * Convert letter to column number (A=0, B=1, ..., Z=25, AA=26, etc.)
 */
export function letterToCol(letter: string): number {
  let result = 0;
  for (let i = 0; i < letter.length; i++) {
    result = result * 26 + (letter.charCodeAt(i) - 64);
  }
  return result - 1;
}

/**
 * Convert pixel position to grid position
 */
export function pixelToGrid(pixel: PixelPosition): GridPosition {
  // Account for canvas offset (nodes are stored at x+5000, y+5000)
  const adjustedX = pixel.x + GRID_CONFIG.OFFSET;
  const adjustedY = pixel.y + GRID_CONFIG.OFFSET;

  const col = Math.floor(adjustedX / GRID_CONFIG.CELL_SIZE);
  const row = Math.floor(adjustedY / GRID_CONFIG.CELL_SIZE);

  return {
    row: Math.max(0, Math.min(row, GRID_CONFIG.GRID_ROWS - 1)),
    col: Math.max(0, Math.min(col, GRID_CONFIG.GRID_COLS - 1)),
    label: `${colToLetter(col)}${row + 1}`,
  };
}

/**
 * Convert grid position to pixel position (center of cell)
 */
export function gridToPixel(grid: GridPosition | string): PixelPosition {
  let row: number;
  let col: number;

  if (typeof grid === 'string') {
    // Parse label like "A1", "B5", "AA23"
    const match = grid.match(/^([A-Z]+)(\d+)$/i);
    if (!match) {
      throw new Error(`Invalid grid label: ${grid}`);
    }
    col = letterToCol(match[1].toUpperCase());
    row = parseInt(match[2], 10) - 1;
  } else {
    row = grid.row;
    col = grid.col;
  }

  // Return center of cell, adjusted for canvas offset
  return {
    x: col * GRID_CONFIG.CELL_SIZE + GRID_CONFIG.CELL_SIZE / 2 - GRID_CONFIG.OFFSET,
    y: row * GRID_CONFIG.CELL_SIZE + GRID_CONFIG.CELL_SIZE / 2 - GRID_CONFIG.OFFSET,
  };
}

// ============================================================================
// Canvas State Description for AI
// ============================================================================

export interface CanvasNode {
  id: string;
  type: string;
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  style?: Record<string, unknown>;
  mediaUrl?: string;
  mediaType?: string;
}

export interface CanvasEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface NodeDescription {
  id: string;
  type: string;
  content: string;
  gridPosition: string;
  pixelPosition: { x: number; y: number };
  size: { width: number; height: number };
  color?: string;
  connections: string[]; // IDs of connected nodes
}

export interface CanvasDescription {
  totalNodes: number;
  totalConnections: number;
  gridBounds: {
    minRow: number;
    maxRow: number;
    minCol: number;
    maxCol: number;
    minLabel: string;
    maxLabel: string;
  };
  nodes: NodeDescription[];
  spatialLayout: string; // Human-readable description of layout
}

/**
 * Generate a description of the canvas state for 8gent
 */
export function describeCanvas(
  nodes: CanvasNode[],
  edges: CanvasEdge[]
): CanvasDescription {
  if (nodes.length === 0) {
    return {
      totalNodes: 0,
      totalConnections: 0,
      gridBounds: {
        minRow: 0,
        maxRow: 0,
        minCol: 0,
        maxCol: 0,
        minLabel: 'A1',
        maxLabel: 'A1',
      },
      nodes: [],
      spatialLayout: 'The canvas is empty.',
    };
  }

  // Convert nodes to descriptions with grid positions
  const nodeDescriptions: NodeDescription[] = nodes.map((node) => {
    const gridPos = pixelToGrid({ x: node.x, y: node.y });
    const connectedEdges = edges.filter(
      (e) => e.source === node.id || e.target === node.id
    );
    const connections = connectedEdges.map((e) =>
      e.source === node.id ? e.target : e.source
    );

    return {
      id: node.id,
      type: node.type,
      content: node.content?.slice(0, 100) || '', // Truncate long content
      gridPosition: gridPos.label,
      pixelPosition: { x: node.x, y: node.y },
      size: { width: node.width, height: node.height },
      color: node.style?.fill as string | undefined,
      connections,
    };
  });

  // Calculate grid bounds
  const gridPositions = nodes.map((n) => pixelToGrid({ x: n.x, y: n.y }));
  const minRow = Math.min(...gridPositions.map((g) => g.row));
  const maxRow = Math.max(...gridPositions.map((g) => g.row));
  const minCol = Math.min(...gridPositions.map((g) => g.col));
  const maxCol = Math.max(...gridPositions.map((g) => g.col));

  // Generate spatial layout description
  const spatialLayout = generateSpatialDescription(nodeDescriptions);

  return {
    totalNodes: nodes.length,
    totalConnections: edges.length,
    gridBounds: {
      minRow,
      maxRow,
      minCol,
      maxCol,
      minLabel: `${colToLetter(minCol)}${minRow + 1}`,
      maxLabel: `${colToLetter(maxCol)}${maxRow + 1}`,
    },
    nodes: nodeDescriptions,
    spatialLayout,
  };
}

/**
 * Generate a human-readable spatial description
 */
function generateSpatialDescription(nodes: NodeDescription[]): string {
  if (nodes.length === 0) return 'The canvas is empty.';
  if (nodes.length === 1) {
    const n = nodes[0];
    return `There is 1 ${n.type} node at position ${n.gridPosition} with content: "${n.content.slice(0, 50)}${n.content.length > 50 ? '...' : ''}"`;
  }

  // Group nodes by approximate row
  const rowGroups = new Map<number, NodeDescription[]>();
  for (const node of nodes) {
    const match = node.gridPosition.match(/\d+/);
    const row = match ? parseInt(match[0], 10) : 0;
    const bucket = Math.floor(row / 5) * 5; // Group in 5-row buckets
    if (!rowGroups.has(bucket)) rowGroups.set(bucket, []);
    rowGroups.get(bucket)!.push(node);
  }

  const lines: string[] = [];
  lines.push(`The canvas has ${nodes.length} nodes spread across the grid.`);

  // Describe top-level layout
  const sortedRows = Array.from(rowGroups.keys()).sort((a, b) => a - b);
  for (const row of sortedRows) {
    const nodesInRow = rowGroups.get(row)!;
    const positions = nodesInRow.map((n) => n.gridPosition).join(', ');
    const types = [...new Set(nodesInRow.map((n) => n.type))].join(', ');
    lines.push(`- Row ${row + 1}-${row + 5}: ${nodesInRow.length} node(s) (${types}) at ${positions}`);
  }

  // Describe connections
  const connectedNodes = nodes.filter((n) => n.connections.length > 0);
  if (connectedNodes.length > 0) {
    lines.push(`\nConnections:`);
    for (const node of connectedNodes) {
      const targetLabels = node.connections
        .map((id) => nodes.find((n) => n.id === id)?.gridPosition || id)
        .join(', ');
      lines.push(`- ${node.gridPosition} connects to: ${targetLabels}`);
    }
  }

  return lines.join('\n');
}

// ============================================================================
// Relative Position Helpers
// ============================================================================

export type Direction = 'above' | 'below' | 'left' | 'right' | 'above-left' | 'above-right' | 'below-left' | 'below-right';

/**
 * Get a position relative to another position
 */
export function getRelativePosition(
  fromLabel: string,
  direction: Direction,
  distance: number = 1
): string {
  const match = fromLabel.match(/^([A-Z]+)(\d+)$/i);
  if (!match) throw new Error(`Invalid grid label: ${fromLabel}`);

  let col = letterToCol(match[1].toUpperCase());
  let row = parseInt(match[2], 10) - 1;

  switch (direction) {
    case 'above':
      row -= distance;
      break;
    case 'below':
      row += distance;
      break;
    case 'left':
      col -= distance;
      break;
    case 'right':
      col += distance;
      break;
    case 'above-left':
      row -= distance;
      col -= distance;
      break;
    case 'above-right':
      row -= distance;
      col += distance;
      break;
    case 'below-left':
      row += distance;
      col -= distance;
      break;
    case 'below-right':
      row += distance;
      col += distance;
      break;
  }

  // Clamp to valid range
  row = Math.max(0, Math.min(row, GRID_CONFIG.GRID_ROWS - 1));
  col = Math.max(0, Math.min(col, GRID_CONFIG.GRID_COLS - 1));

  return `${colToLetter(col)}${row + 1}`;
}

/**
 * Calculate direction between two positions
 */
export function getDirectionBetween(fromLabel: string, toLabel: string): Direction | 'same' {
  const fromMatch = fromLabel.match(/^([A-Z]+)(\d+)$/i);
  const toMatch = toLabel.match(/^([A-Z]+)(\d+)$/i);
  if (!fromMatch || !toMatch) return 'same';

  const fromCol = letterToCol(fromMatch[1].toUpperCase());
  const fromRow = parseInt(fromMatch[2], 10);
  const toCol = letterToCol(toMatch[1].toUpperCase());
  const toRow = parseInt(toMatch[2], 10);

  const rowDiff = toRow - fromRow;
  const colDiff = toCol - fromCol;

  if (rowDiff === 0 && colDiff === 0) return 'same';
  if (rowDiff < 0 && colDiff === 0) return 'above';
  if (rowDiff > 0 && colDiff === 0) return 'below';
  if (rowDiff === 0 && colDiff < 0) return 'left';
  if (rowDiff === 0 && colDiff > 0) return 'right';
  if (rowDiff < 0 && colDiff < 0) return 'above-left';
  if (rowDiff < 0 && colDiff > 0) return 'above-right';
  if (rowDiff > 0 && colDiff < 0) return 'below-left';
  return 'below-right';
}

// ============================================================================
// Node Colors
// ============================================================================

export const NODE_COLORS = {
  yellow: '#fef08a',
  blue: '#93c5fd',
  green: '#86efac',
  pink: '#f9a8d4',
  purple: '#c4b5fd',
  orange: '#fed7aa',
  red: '#fca5a5',
  cyan: '#a5f3fc',
  white: '#ffffff',
  gray: '#d1d5db',
} as const;

export type NodeColor = keyof typeof NODE_COLORS;

export function getColorHex(colorName: string): string {
  const normalized = colorName.toLowerCase() as NodeColor;
  return NODE_COLORS[normalized] || NODE_COLORS.yellow;
}

export function getColorName(hex: string): NodeColor {
  const entry = Object.entries(NODE_COLORS).find(([, v]) => v.toLowerCase() === hex.toLowerCase());
  return (entry?.[0] as NodeColor) || 'yellow';
}
