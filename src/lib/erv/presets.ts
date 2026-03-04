/**
 * ERV Preset Dimension Configurations
 *
 * Built-in dimensions that users have out of the box.
 * Each preset is just a saved DimensionConfig.
 */

import type { PresetDimension, DimensionConfig } from "./types";

// =============================================================================
// Feed Dimension - Chronological timeline of all entities
// =============================================================================

export const FEED_DIMENSION: PresetDimension = {
  id: "feed",
  name: "Feed",
  description: "Chronological timeline of all your entities",
  icon: "List",
  isPreset: true,

  container: "card",
  arrangement: "list",
  entityShape: "square",
  connectionStyle: "none",
  decorations: [
    { type: "badge", condition: "entityType" },
    { type: "shadow" },
  ],
  interactions: [
    { type: "click", action: "navigate" },
    { type: "hover", action: "preview" },
  ],
  transition: "fade",

  sort: {
    field: "updatedAt",
    direction: "desc",
  },
  itemSize: "md",
  gap: 4,
};

// =============================================================================
// Kanban Dimension - Status-based board view
// =============================================================================

export const KANBAN_DIMENSION: PresetDimension = {
  id: "kanban",
  name: "Kanban",
  description: "Drag and drop board organized by status",
  icon: "Columns3",
  isPreset: true,

  container: "panel",
  arrangement: "grid",
  entityShape: "square",
  connectionStyle: "none",
  decorations: [
    { type: "badge", condition: "priority" },
    { type: "border" },
  ],
  interactions: [
    { type: "drag", action: "edit" },
    { type: "click", action: "navigate" },
  ],
  transition: "slide",

  defaultFilter: {
    entityTypes: ["Ticket"],
  },
  group: {
    by: "status",
    showEmpty: true,
  },
  columns: 5,
  gap: 4,
};

// =============================================================================
// Graph Dimension - 2D knowledge graph
// =============================================================================

export const GRAPH_DIMENSION: PresetDimension = {
  id: "graph",
  name: "Graph",
  description: "2D visualization of entity relationships",
  icon: "GitBranch",
  isPreset: true,

  container: "frame",
  arrangement: "graph",
  entityShape: "circle",
  connectionStyle: "curve",
  decorations: [
    { type: "glow", condition: "importance > 0.7" },
    { type: "label" },
  ],
  interactions: [
    { type: "click", action: "select" },
    { type: "drag", action: "custom" },
    { type: "hover", action: "preview" },
  ],
  transition: "scale",

  is3D: false,
  physicsEnabled: true,
  sizeMapping: {
    field: "connections",
    min: 20,
    max: 60,
  },
  colorMapping: {
    field: "entityType",
    palette: {
      Person: "#f59e0b",
      Project: "#22c55e",
      Track: "#3b82f6",
      Ticket: "#8b5cf6",
      Memory: "#ec4899",
      Event: "#06b6d4",
    },
  },
};

// =============================================================================
// Graph 3D Dimension - Fly-through constellation
// =============================================================================

export const GRAPH_3D_DIMENSION: PresetDimension = {
  id: "graph-3d",
  name: "Constellation",
  description: "3D knowledge graph you can fly through",
  icon: "Orbit",
  isPreset: true,

  container: "frame",
  arrangement: "graph",
  entityShape: "circle",
  connectionStyle: "line",
  decorations: [
    { type: "glow" },
  ],
  interactions: [
    { type: "click", action: "select" },
    { type: "pinch", action: "custom" },
  ],
  transition: "scale",

  is3D: true,
  physicsEnabled: true,
  cameraPosition: { x: 0, y: 0, z: 100 },
  sizeMapping: {
    field: "connections",
    min: 1,
    max: 4,
  },
  colorMapping: {
    field: "entityType",
    palette: {
      Person: "#fbbf24",
      Project: "#4ade80",
      Track: "#60a5fa",
      Ticket: "#a78bfa",
      Memory: "#f472b6",
      Event: "#22d3ee",
    },
  },
};

// =============================================================================
// Calendar Dimension - Time-based event view
// =============================================================================

export const CALENDAR_DIMENSION: PresetDimension = {
  id: "calendar",
  name: "Calendar",
  description: "Time-based view for events and deadlines",
  icon: "Calendar",
  isPreset: true,

  container: "panel",
  arrangement: "grid",
  entityShape: "square",
  connectionStyle: "none",
  decorations: [
    { type: "border" },
    { type: "badge", condition: "entityType" },
  ],
  interactions: [
    { type: "click", action: "navigate" },
    { type: "drag", action: "edit" },
  ],
  transition: "slide",

  defaultFilter: {
    entityTypes: ["Event"],
  },
  group: {
    by: "date",
    showEmpty: true,
  },
  columns: 7,
  gap: 2,
};

// =============================================================================
// Grid Dimension - Visual gallery
// =============================================================================

export const GRID_DIMENSION: PresetDimension = {
  id: "grid",
  name: "Grid",
  description: "Visual grid of entity cards",
  icon: "Grid3x3",
  isPreset: true,

  container: "card",
  arrangement: "grid",
  entityShape: "square",
  connectionStyle: "none",
  decorations: [
    { type: "shadow" },
    { type: "badge", condition: "entityType" },
  ],
  interactions: [
    { type: "click", action: "navigate" },
    { type: "hover", action: "preview" },
  ],
  transition: "scale",

  columns: 4,
  gap: 6,
  itemSize: "md",
};

// =============================================================================
// iPod Dimension - Music player interface
// =============================================================================

export const IPOD_DIMENSION: PresetDimension = {
  id: "ipod",
  name: "iPod",
  description: "Music player interface for tracks",
  icon: "Disc3",
  isPreset: true,

  container: "card",
  arrangement: "flow",
  entityShape: "square",
  connectionStyle: "none",
  decorations: [
    { type: "shadow" },
    { type: "glow", condition: "isPlaying" },
  ],
  interactions: [
    { type: "click", action: "custom" },
    { type: "hover", action: "preview" },
  ],
  transition: "slide",

  defaultFilter: {
    entityTypes: ["Track"],
  },
  sort: {
    field: "updatedAt",
    direction: "desc",
  },
  itemSize: "lg",
  gap: 8,
};

// =============================================================================
// Quest Log Dimension - Gamified project view
// =============================================================================

export const QUEST_LOG_DIMENSION: PresetDimension = {
  id: "quest-log",
  name: "Quest Log",
  description: "View projects as epic quests",
  icon: "Sword",
  isPreset: true,
  metaphor: "dungeon",

  container: "panel",
  arrangement: "list",
  entityShape: "square",
  connectionStyle: "none",
  decorations: [
    { type: "badge", condition: "priority" },
    { type: "border" },
    { type: "glow", condition: "status === 'in_progress'" },
  ],
  interactions: [
    { type: "click", action: "navigate" },
    { type: "hover", action: "preview" },
  ],
  transition: "slide",

  defaultFilter: {
    entityTypes: ["Project", "Epic"],
  },
  sort: {
    field: "importance",
    direction: "desc",
  },
  itemSize: "lg",
  gap: 4,
};

// =============================================================================
// Skill Tree Dimension - Knowledge visualization
// =============================================================================

export const SKILL_TREE_DIMENSION: PresetDimension = {
  id: "skill-tree",
  name: "Skill Tree",
  description: "Visualize knowledge as unlockable skills",
  icon: "Network",
  isPreset: true,
  metaphor: "tree",

  container: "frame",
  arrangement: "tree",
  entityShape: "circle",
  connectionStyle: "curve",
  decorations: [
    { type: "border" },
    { type: "glow", condition: "unlocked" },
  ],
  interactions: [
    { type: "click", action: "select" },
    { type: "hover", action: "preview" },
  ],
  transition: "scale",

  defaultFilter: {
    entityTypes: ["Skill"],
  },
  sizeMapping: {
    field: "importance",
    min: 30,
    max: 60,
  },
};

// =============================================================================
// Agent Tasks Dimension - Background jobs and autonomous work
// =============================================================================

export const AGENT_TASKS_DIMENSION: PresetDimension = {
  id: "agent-tasks",
  name: "Agent Tasks",
  description: "Monitor background tasks, code iterations, and specialist delegations",
  icon: "Bot",
  isPreset: true,
  metaphor: "dungeon",

  container: "panel",
  arrangement: "list",
  entityShape: "square",
  connectionStyle: "arrow",
  decorations: [
    { type: "badge", condition: "status" },
    { type: "glow", condition: "status === running" },
    { type: "border" },
  ],
  interactions: [
    { type: "click", action: "navigate" },
    { type: "hover", action: "preview" },
  ],
  transition: "slide",

  defaultFilter: {
    entityTypes: ["AgentTask"],
  },
  group: {
    by: "status",
    showEmpty: true,
  },
  sort: {
    field: "updatedAt",
    direction: "desc",
  },
  colorMapping: {
    field: "status",
    palette: {
      queued: "#6b7280", // gray
      running: "#3b82f6", // blue
      succeeded: "#22c55e", // green
      failed: "#ef4444", // red
      cancelled: "#f59e0b", // amber
    },
  },
  itemSize: "md",
  gap: 3,
};

// =============================================================================
// All Presets
// =============================================================================

export const PRESET_DIMENSIONS: Record<string, PresetDimension> = {
  feed: FEED_DIMENSION,
  kanban: KANBAN_DIMENSION,
  graph: GRAPH_DIMENSION,
  "graph-3d": GRAPH_3D_DIMENSION,
  calendar: CALENDAR_DIMENSION,
  grid: GRID_DIMENSION,
  ipod: IPOD_DIMENSION,
  "quest-log": QUEST_LOG_DIMENSION,
  "skill-tree": SKILL_TREE_DIMENSION,
  "agent-tasks": AGENT_TASKS_DIMENSION,
};

// =============================================================================
// Helper Functions
// =============================================================================

export function getPresetDimension(id: string): DimensionConfig | null {
  return PRESET_DIMENSIONS[id] || null;
}

export function getAllPresets(): PresetDimension[] {
  return Object.values(PRESET_DIMENSIONS);
}

export function getDimensionIcon(dimensionId: string): string {
  return PRESET_DIMENSIONS[dimensionId]?.icon || "Layers";
}

export function getDimensionGradient(dimensionId: string): string {
  const gradients: Record<string, string> = {
    feed: "from-zinc-500 to-zinc-700",
    kanban: "from-emerald-500 to-teal-600",
    graph: "from-violet-500 to-purple-600",
    "graph-3d": "from-indigo-500 to-blue-600",
    calendar: "from-cyan-500 to-blue-600",
    grid: "from-orange-500 to-amber-600",
    ipod: "from-pink-500 to-rose-600",
    "quest-log": "from-amber-500 to-yellow-600",
    "skill-tree": "from-green-500 to-emerald-600",
    "agent-tasks": "from-blue-500 to-indigo-600",
  };
  return gradients[dimensionId] || "from-gray-500 to-gray-700";
}
