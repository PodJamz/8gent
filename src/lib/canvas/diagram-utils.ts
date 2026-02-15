/**
 * Canvas Diagram Utilities
 * 
 * Conversion between canvas nodes/edges, Mermaid syntax, JSON export format,
 * and SVG generation. Modeled after Excalidraw's data layer.
 */

// ============================================================================
// Types
// ============================================================================

export interface CanvasNodeData {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  style?: Record<string, unknown>;
}

export interface CanvasEdgeData {
  id: string;
  source: string;
  target: string;
  type: string;
  label?: string;
}

export interface DrawingElementData {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  points?: { x: number; y: number }[];
  strokeColor: string;
  backgroundColor: string;
  fillStyle: string;
  strokeWidth: number;
  strokeStyle: string;
  opacity: number;
  roughness: number;
  text?: string;
  fontSize?: number;
  startArrowhead?: string | null;
  endArrowhead?: string | null;
  rotation?: number;
}

export interface CanvasExportData {
  type: "openclaw-canvas";
  version: 2;
  name: string;
  createdAt: string;
  nodes: CanvasNodeData[];
  edges: CanvasEdgeData[];
  drawingElements: DrawingElementData[];
  viewport: { x: number; y: number; zoom: number };
}

// ============================================================================
// Canvas to Mermaid
// ============================================================================

export function canvasToMermaid(
  nodes: CanvasNodeData[],
  edges: CanvasEdgeData[]
): string {
  const lines: string[] = ["flowchart TD"];
  const nodeMap = new Map<string, string>();

  // Map node IDs to simple labels
  nodes.forEach((node, i) => {
    const label = node.content?.replace(/[[\]{}()|]/g, "") || `Node${i}`;
    const shortId = `N${i}`;
    nodeMap.set(node.id, shortId);

    // Determine shape syntax based on type
    switch (node.type) {
      case "flow-decision":
        lines.push(`    ${shortId}{${label}}`);
        break;
      case "flow-start":
      case "flow-end":
        lines.push(`    ${shortId}([${label}])`);
        break;
      case "flow-process":
        lines.push(`    ${shortId}[${label}]`);
        break;
      case "flow-data":
        lines.push(`    ${shortId}[/${label}/]`);
        break;
      case "flow-subprocess":
        lines.push(`    ${shortId}[[${label}]]`);
        break;
      case "arch-database":
        lines.push(`    ${shortId}[(${label})]`);
        break;
      case "arch-service":
      case "arch-api":
        lines.push(`    ${shortId}[${label}]`);
        break;
      case "arch-client":
        lines.push(`    ${shortId}(${label})`);
        break;
      case "arch-queue":
        lines.push(`    ${shortId}>>${label}]`);
        break;
      case "arch-cloud":
        lines.push(`    ${shortId}{{${label}}}`);
        break;
      default:
        // Generic rectangle for unknown types
        lines.push(`    ${shortId}["${label}"]`);
    }
  });

  // Add edges
  edges.forEach((edge) => {
    const source = nodeMap.get(edge.source);
    const target = nodeMap.get(edge.target);
    if (source && target) {
      if (edge.label) {
        lines.push(`    ${source} -->|${edge.label}| ${target}`);
      } else {
        lines.push(`    ${source} --> ${target}`);
      }
    }
  });

  return lines.join("\n");
}

// ============================================================================
// Mermaid to Canvas Nodes
// ============================================================================

interface MermaidParseResult {
  nodes: CanvasNodeData[];
  edges: CanvasEdgeData[];
}

export async function mermaidToCanvas(
  definition: string,
  startX: number = 0,
  startY: number = 0
): Promise<MermaidParseResult> {
  const nodes: CanvasNodeData[] = [];
  const edges: CanvasEdgeData[] = [];
  const nodeIdMap = new Map<string, string>();

  // Parse Mermaid syntax manually for basic flowcharts
  const lines = definition.split("\n").map(l => l.trim()).filter(l => l && !l.startsWith("%%"));

  // Skip the graph/flowchart declaration
  const contentLines = lines.filter(l => !l.match(/^(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram)\s/i));

  let nodeIndex = 0;
  const SPACING_X = 250;
  const SPACING_Y = 150;
  const COLS = 3;

  for (const line of contentLines) {
    // Parse node definitions with shapes
    // Patterns: A[text], A(text), A{text}, A([text]), A[[text]], A[(text)], A{{text}}
    const nodePatterns = [
      /(\w+)\(\[([^\]]*)\]\)/g,   // ([text]) - stadium
      /(\w+)\[\[([^\]]*)\]\]/g,   // [[text]] - subprocess
      /(\w+)\[\(([^)]*)\)\]/g,    // [(text)] - cylinder
      /(\w+)\{\{([^}]*)\}\}/g,    // {{text}} - hexagon
      /(\w+)\{([^}]*)\}/g,        // {text} - diamond
      /(\w+)\[\/([^/]*)\/\]/g,    // [/text/] - parallelogram
      /(\w+)\(([^)]*)\)/g,        // (text) - round
      /(\w+)\["([^"]*)"\]/g,      // ["text"] - quoted
      /(\w+)\[([^\]]*)\]/g,       // [text] - rectangle
    ];

    for (const pattern of nodePatterns) {
      pattern.lastIndex = 0;
      let match;
      while ((match = pattern.exec(line)) !== null) {
        const id = match[1];
        const text = match[2];
        if (!nodeIdMap.has(id)) {
          const col = nodeIndex % COLS;
          const row = Math.floor(nodeIndex / COLS);
          const canvasId = `node-mermaid-${Date.now()}-${nodeIndex}`;

          // Determine type from shape
          let type = "flow-process";
          if (pattern.source.includes("\\(\\[")) type = "flow-start";
          else if (pattern.source.includes("\\{\\{")) type = "arch-cloud";
          else if (pattern.source.includes("\\{")) type = "flow-decision";
          else if (pattern.source.includes("\\[\\(")) type = "arch-database";
          else if (pattern.source.includes("\\[\\[")) type = "flow-subprocess";
          else if (pattern.source.includes("\\/")) type = "flow-data";
          else if (pattern.source.includes("\\(")) type = "flow-start";

          nodes.push({
            id: canvasId,
            type,
            x: startX + col * SPACING_X,
            y: startY + row * SPACING_Y,
            width: 180,
            height: 80,
            content: text,
            style: { fill: getTypeColor(type) },
          });
          nodeIdMap.set(id, canvasId);
          nodeIndex++;
        }
      }
    }

    // Parse edges: A --> B, A -->|label| B, A --- B, A -.-> B, A ==> B
    const edgePattern = /(\w+)\s*(-+\.?->?|=+>|--+)\s*(?:\|([^|]*)\|\s*)?(\w+)/g;
    let edgeMatch;
    while ((edgeMatch = edgePattern.exec(line)) !== null) {
      const sourceId = edgeMatch[1];
      const label = edgeMatch[3] || undefined;
      const targetId = edgeMatch[4];

      // Ensure both nodes exist
      if (!nodeIdMap.has(sourceId)) {
        const col = nodeIndex % COLS;
        const row = Math.floor(nodeIndex / COLS);
        const canvasId = `node-mermaid-${Date.now()}-${nodeIndex}`;
        nodes.push({
          id: canvasId, type: "flow-process",
          x: startX + col * SPACING_X, y: startY + row * SPACING_Y,
          width: 180, height: 80, content: sourceId,
          style: { fill: "#3b82f6" },
        });
        nodeIdMap.set(sourceId, canvasId);
        nodeIndex++;
      }
      if (!nodeIdMap.has(targetId)) {
        const col = nodeIndex % COLS;
        const row = Math.floor(nodeIndex / COLS);
        const canvasId = `node-mermaid-${Date.now()}-${nodeIndex}`;
        nodes.push({
          id: canvasId, type: "flow-process",
          x: startX + col * SPACING_X, y: startY + row * SPACING_Y,
          width: 180, height: 80, content: targetId,
          style: { fill: "#3b82f6" },
        });
        nodeIdMap.set(targetId, canvasId);
        nodeIndex++;
      }

      const sourceCanvasId = nodeIdMap.get(sourceId)!;
      const targetCanvasId = nodeIdMap.get(targetId)!;

      edges.push({
        id: `edge-mermaid-${Date.now()}-${edges.length}`,
        source: sourceCanvasId,
        target: targetCanvasId,
        type: "arrow",
        label,
      });
    }
  }

  // Auto-layout: arrange nodes in a top-down tree
  if (edges.length > 0) {
    autoLayoutTree(nodes, edges, startX, startY);
  }

  return { nodes, edges };
}

// ============================================================================
// Auto Layout
// ============================================================================

function autoLayoutTree(
  nodes: CanvasNodeData[],
  edges: CanvasEdgeData[],
  startX: number,
  startY: number
) {
  // Build adjacency list
  const children = new Map<string, string[]>();
  const hasParent = new Set<string>();

  for (const edge of edges) {
    if (!children.has(edge.source)) children.set(edge.source, []);
    children.get(edge.source)!.push(edge.target);
    hasParent.add(edge.target);
  }

  // Find roots (nodes with no incoming edges)
  const roots = nodes.filter(n => !hasParent.has(n.id)).map(n => n.id);
  if (roots.length === 0 && nodes.length > 0) roots.push(nodes[0].id);

  const levels = new Map<string, number>();
  const queue = roots.map(id => ({ id, level: 0 }));
  const visited = new Set<string>();

  while (queue.length > 0) {
    const { id, level } = queue.shift()!;
    if (visited.has(id)) continue;
    visited.add(id);
    levels.set(id, level);

    const kids = children.get(id) || [];
    for (const kid of kids) {
      queue.push({ id: kid, level: level + 1 });
    }
  }

  // Group by level
  const levelGroups = new Map<number, string[]>();
  for (const [id, level] of levels) {
    if (!levelGroups.has(level)) levelGroups.set(level, []);
    levelGroups.get(level)!.push(id);
  }

  // Position nodes
  const SPACING_X = 250;
  const SPACING_Y = 150;

  for (const [level, ids] of levelGroups) {
    const totalWidth = (ids.length - 1) * SPACING_X;
    const offsetX = -totalWidth / 2;

    ids.forEach((id, i) => {
      const node = nodes.find(n => n.id === id);
      if (node) {
        node.x = startX + offsetX + i * SPACING_X;
        node.y = startY + level * SPACING_Y;
      }
    });
  }
}

function getTypeColor(type: string): string {
  const colors: Record<string, string> = {
    "flow-start": "#22c55e",
    "flow-end": "#ef4444",
    "flow-decision": "#f59e0b",
    "flow-process": "#3b82f6",
    "flow-data": "#8b5cf6",
    "flow-subprocess": "#06b6d4",
    "arch-database": "#6366f1",
    "arch-service": "#3b82f6",
    "arch-api": "#10b981",
    "arch-client": "#f97316",
    "arch-cloud": "#8b5cf6",
    "arch-queue": "#ec4899",
  };
  return colors[type] || "#3b82f6";
}

// ============================================================================
// Serialize / Deserialize Canvas
// ============================================================================

export function serializeCanvas(
  name: string,
  nodes: CanvasNodeData[],
  edges: CanvasEdgeData[],
  drawingElements: DrawingElementData[] = [],
  viewport: { x: number; y: number; zoom: number }
): string {
  const data: CanvasExportData = {
    type: "openclaw-canvas",
    version: 2,
    name,
    createdAt: new Date().toISOString(),
    nodes,
    edges,
    drawingElements,
    viewport,
  };
  return JSON.stringify(data, null, 2);
}

export function deserializeCanvas(json: string): CanvasExportData | null {
  try {
    const data = JSON.parse(json);
    if (data.type !== "openclaw-canvas") {
      console.warn("Unknown canvas format, attempting import anyway");
    }
    return {
      type: "openclaw-canvas",
      version: data.version || 1,
      name: data.name || "Imported Canvas",
      createdAt: data.createdAt || new Date().toISOString(),
      nodes: Array.isArray(data.nodes) ? data.nodes : Array.isArray(data.elements) ? data.elements : [],
      edges: Array.isArray(data.edges) ? data.edges : [],
      drawingElements: Array.isArray(data.drawingElements) ? data.drawingElements : [],
      viewport: data.viewport || { x: 0, y: 0, zoom: 1 },
    };
  } catch (e) {
    console.error("Failed to deserialize canvas:", e);
    return null;
  }
}

// ============================================================================
// Canvas to SVG
// ============================================================================

export function canvasToSVG(
  nodes: CanvasNodeData[],
  edges: CanvasEdgeData[],
  drawingElements: DrawingElementData[] = [],
  options: { background?: string; padding?: number } = {}
): string {
  const { background = "#ffffff", padding = 40 } = options;

  // Calculate bounds
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

  for (const node of nodes) {
    minX = Math.min(minX, node.x);
    minY = Math.min(minY, node.y);
    maxX = Math.max(maxX, node.x + node.width);
    maxY = Math.max(maxY, node.y + node.height);
  }

  for (const el of drawingElements) {
    minX = Math.min(minX, el.x);
    minY = Math.min(minY, el.y);
    maxX = Math.max(maxX, el.x + el.width);
    maxY = Math.max(maxY, el.y + el.height);
  }

  if (minX === Infinity) { minX = 0; minY = 0; maxX = 400; maxY = 300; }

  const width = maxX - minX + padding * 2;
  const height = maxY - minY + padding * 2;
  const offsetX = -minX + padding;
  const offsetY = -minY + padding;

  const parts: string[] = [];
  parts.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`);
  parts.push(`  <rect width="100%" height="100%" fill="${escapeXml(background)}" />`);
  parts.push(`  <g transform="translate(${offsetX}, ${offsetY})">`);

  // Render edges
  parts.push(`    <defs><marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" /></marker></defs>`);

  for (const edge of edges) {
    const src = nodes.find(n => n.id === edge.source);
    const tgt = nodes.find(n => n.id === edge.target);
    if (src && tgt) {
      const x1 = src.x + src.width / 2;
      const y1 = src.y + src.height / 2;
      const x2 = tgt.x + tgt.width / 2;
      const y2 = tgt.y + tgt.height / 2;
      parts.push(`    <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#6b7280" stroke-width="2" marker-end="url(#arrowhead)" />`);
      if (edge.label) {
        const mx = (x1 + x2) / 2;
        const my = (y1 + y2) / 2;
        parts.push(`    <text x="${mx}" y="${my - 8}" text-anchor="middle" font-size="12" fill="#6b7280">${escapeXml(edge.label)}</text>`);
      }
    }
  }

  // Render nodes
  for (const node of nodes) {
    const fill = (node.style?.fill as string) || "#3b82f6";
    const label = node.content || "";

    if (node.type === "flow-decision") {
      const cx = node.x + node.width / 2;
      const cy = node.y + node.height / 2;
      parts.push(`    <polygon points="${cx},${node.y} ${node.x + node.width},${cy} ${cx},${node.y + node.height} ${node.x},${cy}" fill="${escapeXml(fill)}" stroke="#1e1e1e" stroke-width="1.5" />`);
    } else if (node.type === "flow-start" || node.type === "flow-end") {
      parts.push(`    <rect x="${node.x}" y="${node.y}" width="${node.width}" height="${node.height}" rx="${node.height / 2}" fill="${escapeXml(fill)}" stroke="#1e1e1e" stroke-width="1.5" />`);
    } else if (node.type === "arch-database") {
      parts.push(`    <ellipse cx="${node.x + node.width / 2}" cy="${node.y + 12}" rx="${node.width / 2}" ry="12" fill="${escapeXml(fill)}" stroke="#1e1e1e" stroke-width="1.5" />`);
      parts.push(`    <rect x="${node.x}" y="${node.y + 12}" width="${node.width}" height="${node.height - 24}" fill="${escapeXml(fill)}" stroke="#1e1e1e" stroke-width="1.5" />`);
      parts.push(`    <ellipse cx="${node.x + node.width / 2}" cy="${node.y + node.height - 12}" rx="${node.width / 2}" ry="12" fill="${escapeXml(fill)}" stroke="#1e1e1e" stroke-width="1.5" />`);
    } else {
      parts.push(`    <rect x="${node.x}" y="${node.y}" width="${node.width}" height="${node.height}" rx="8" fill="${escapeXml(fill)}" stroke="#1e1e1e" stroke-width="1.5" />`);
    }

    parts.push(`    <text x="${node.x + node.width / 2}" y="${node.y + node.height / 2}" text-anchor="middle" dominant-baseline="middle" font-size="14" fill="white" font-family="system-ui, sans-serif">${escapeXml(label)}</text>`);
  }

  // Render drawing elements
  for (const el of drawingElements) {
    const stroke = escapeXml(el.strokeColor || "#1e1e1e");
    const sw = el.strokeWidth || 2;
    const fill = el.fillStyle === "solid" ? escapeXml(el.backgroundColor || "none") : "none";
    const dasharray = el.strokeStyle === "dashed" ? ' stroke-dasharray="12,6"' : el.strokeStyle === "dotted" ? ' stroke-dasharray="3,6"' : "";

    if (el.type === "rectangle") {
      parts.push(`    <rect x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${dasharray} opacity="${(el.opacity || 100) / 100}" />`);
    } else if (el.type === "ellipse") {
      parts.push(`    <ellipse cx="${el.x + el.width / 2}" cy="${el.y + el.height / 2}" rx="${el.width / 2}" ry="${el.height / 2}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${dasharray} opacity="${(el.opacity || 100) / 100}" />`);
    } else if (el.type === "diamond") {
      const cx = el.x + el.width / 2;
      const cy = el.y + el.height / 2;
      parts.push(`    <polygon points="${cx},${el.y} ${el.x + el.width},${cy} ${cx},${el.y + el.height} ${el.x},${cy}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${dasharray} />`);
    } else if ((el.type === "line" || el.type === "arrow" || el.type === "freedraw") && el.points) {
      const pts = el.points.map(p => `${el.x + p.x},${el.y + p.y}`).join(" ");
      parts.push(`    <polyline points="${pts}" fill="none" stroke="${stroke}" stroke-width="${sw}"${dasharray} />`);
    }
  }

  parts.push("  </g>");
  parts.push("</svg>");
  return parts.join("\n");
}

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// ============================================================================
// AI Diagram Prompt Builder
// ============================================================================

export function buildDiagramPrompt(description: string): string {
  return `Generate a Mermaid diagram based on this description. Return ONLY the Mermaid syntax, no explanation or markdown fences.

Description: ${description}

Rules:
- Use "flowchart TD" for top-down flow diagrams
- Use "flowchart LR" for left-right flow diagrams
- Use descriptive node labels
- Use appropriate shapes: [rect], (round), {diamond}, ([stadium]), [[subprocess]]
- Add edge labels where meaningful
- Keep it clean and readable
- Maximum 15 nodes for clarity`;
}

// ============================================================================
// Example Mermaid Templates
// ============================================================================

export const MERMAID_TEMPLATES: Record<string, { label: string; code: string }> = {
  flowchart: {
    label: "Flowchart",
    code: `flowchart TD
    A([Start]) --> B[Process Data]
    B --> C{Valid?}
    C -->|Yes| D[Save to DB]
    C -->|No| E[Show Error]
    D --> F([End])
    E --> B`,
  },
  sequence: {
    label: "Sequence Diagram",
    code: `sequenceDiagram
    participant U as User
    participant S as Server
    participant DB as Database
    U->>S: Request Data
    S->>DB: Query
    DB-->>S: Results
    S-->>U: Response`,
  },
  architecture: {
    label: "Architecture",
    code: `flowchart LR
    Client[Browser Client] --> API[API Gateway]
    API --> Auth[Auth Service]
    API --> Core[Core Service]
    Core --> DB[(PostgreSQL)]
    Core --> Cache[(Redis)]
    Core --> Queue[Message Queue]
    Queue --> Worker[Worker Service]`,
  },
  state: {
    label: "State Machine",
    code: `stateDiagram-v2
    [*] --> Idle
    Idle --> Loading: fetch
    Loading --> Success: resolve
    Loading --> Error: reject
    Success --> Idle: reset
    Error --> Loading: retry
    Error --> Idle: dismiss`,
  },
  er: {
    label: "ER Diagram",
    code: `erDiagram
    USER ||--o{ POST : writes
    USER ||--o{ COMMENT : makes
    POST ||--o{ COMMENT : has
    POST }o--|| CATEGORY : belongs_to
    USER {
      int id
      string name
      string email
    }
    POST {
      int id
      string title
      text content
    }`,
  },
  gitgraph: {
    label: "Git Graph",
    code: `gitGraph
    commit
    branch develop
    checkout develop
    commit
    commit
    checkout main
    merge develop
    commit
    branch feature
    checkout feature
    commit
    checkout develop
    merge feature
    checkout main
    merge develop`,
  },
};
