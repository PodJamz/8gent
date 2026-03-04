/**
 * ERV Architecture Type Definitions
 *
 * Entity-Relationship-View types for infinite dimensional rendering.
 * The OpenClaw composes primitives to generate ANY dimension from description.
 */

// =============================================================================
// Entity Types
// =============================================================================

export type EntityType =
  | "Person"
  | "Project"
  | "Track"
  | "Draft"
  | "Sketch"
  | "Ticket"
  | "Epic"
  | "Event"
  | "Memory"
  | "Value"
  | "Dimension"
  | "Collection"
  | "Skill"
  | "Reminder"
  | "AgentTask";

export interface Entity {
  _id: string;
  entityId: string;
  entityType: EntityType;
  name: string;
  thumbnail?: string;
  data: string; // JSON stringified type-specific data
  tags: string[];
  searchText: string;
  ownerId: string;
  createdAt: number;
  updatedAt: number;
  archivedAt?: number;
  source?: string;
  importance?: number;
}

// Type-specific data shapes
export interface PersonData {
  email?: string;
  phone?: string;
  company?: string;
  title?: string;
  location?: string;
  links: string[];
  avatarUrl?: string;
  notes?: string;
}

export interface ProjectData {
  status: "discovery" | "design" | "planning" | "building" | "launched" | "archived";
  color: string;
  icon?: string;
  githubRepo?: string;
  githubIssuePrefix?: string;
  prdId?: string;
}

export interface TicketData {
  ticketId: string;
  type: "story" | "bug" | "task" | "spike" | "chore";
  priority: "P0" | "P1" | "P2" | "P3";
  status: "backlog" | "todo" | "in_progress" | "review" | "done" | "cancelled";
  asA?: string;
  iWant?: string;
  soThat?: string;
  assigneeId?: string;
  assigneeName?: string;
  storyPoints?: number;
  labels?: string[];
  branchName?: string;
  githubIssueUrl?: string;
}

export interface MemoryData {
  memoryType: "interaction" | "observation" | "decision" | "milestone" | "reflection";
  content: string;
  context?: string;
  importance: number;
  emotion?: string;
  timestamp: number;
  decayRate?: number;
}

export interface TrackData {
  artist: string;
  album?: string;
  albumArt?: string;
  audioUrl: string;
  duration?: number;
  bpm?: number;
  key?: string;
  lyrics?: string;
  isPrivate: boolean;
}

export interface EventData {
  startTime: number;
  endTime: number;
  timezone: string;
  location?: string;
  locationType?: "google_meet" | "zoom" | "phone" | "in_person" | "custom";
  description?: string;
  isAllDay: boolean;
  recurrence?: string;
  googleEventId?: string;
}

export interface AgentTaskData {
  jobId: string;
  jobType: "agent_task" | "code_iteration" | "specialist_delegation";
  status: "queued" | "running" | "succeeded" | "failed" | "cancelled";
  task: string;
  label?: string;
  priority: "low" | "normal" | "high";
  progress?: number; // 0-100
  progressMessage?: string;
  specialist?: string; // For delegation tasks
  sandboxId?: string; // For code iteration tasks
  testCommand?: string;
  maxIterations?: number;
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
  lastError?: string;
  startedAt?: number;
  completedAt?: number;
  announceResult: boolean;
  context?: {
    projectId?: string;
    ticketId?: string;
    sandboxId?: string;
    repositoryUrl?: string;
  };
}

// =============================================================================
// Relationship Types
// =============================================================================

export type RelationshipType =
  | "collaboratedOn"
  | "createdBy"
  | "assignedTo"
  | "belongsTo"
  | "contains"
  | "parentOf"
  | "mentions"
  | "relatedTo"
  | "derivedFrom"
  | "followedBy"
  | "blockedBy"
  | "spawnedFor" // AgentTask -> Project/Ticket it's working on
  | "executedIn" // AgentTask -> Sandbox it runs in
  | "delegatedTo" // AgentTask -> Specialist type
  | "custom";

export interface Relationship {
  _id: string;
  sourceEntityId: string;
  targetEntityId: string;
  relationshipType: RelationshipType;
  bidirectional: boolean;
  weight?: number;
  label?: string;
  metadata?: string;
  createdAt: number;
  createdBy: string;
}

// =============================================================================
// Rendering Primitive Types
// =============================================================================

export type ContainerType = "frame" | "panel" | "card" | "window";
export type ArrangementType = "grid" | "list" | "flow" | "spiral" | "orbit" | "tree" | "graph";
export type ShapeType = "circle" | "square" | "hexagon" | "custom";
export type ConnectionType = "line" | "curve" | "arrow" | "glow" | "none";
export type DecorationType = "glow" | "shadow" | "border" | "badge" | "label";
export type InteractionType = "drag" | "click" | "hover" | "longpress" | "pinch";
export type TransitionType = "morph" | "fade" | "slide" | "scale";

// =============================================================================
// Dimension Configuration
// =============================================================================

export interface DimensionFilter {
  entityTypes?: EntityType[];
  tags?: string[];
  dateRange?: {
    start?: number;
    end?: number;
  };
  search?: string;
  status?: string[];
  customPredicate?: string; // JSON stringified predicate
}

export interface DimensionSort {
  field: "createdAt" | "updatedAt" | "name" | "importance" | string;
  direction: "asc" | "desc";
}

export interface DimensionGroup {
  by: "entityType" | "tag" | "date" | "status" | string;
  showEmpty: boolean;
}

export interface SizeMapping {
  field: "importance" | "connections" | "age" | string;
  min: number;
  max: number;
}

export interface ColorMapping {
  field: "entityType" | "status" | "tag" | string;
  palette: Record<string, string>;
}

export interface DecorationConfig {
  type: DecorationType;
  condition?: string; // e.g., "importance > 0.8"
  value?: string | number;
}

export interface InteractionConfig {
  type: InteractionType;
  action: "select" | "navigate" | "edit" | "preview" | "reveal" | "custom";
  customHandler?: string;
}

export interface DimensionConfig {
  // Identity
  id: string;
  name: string;
  description?: string;
  icon?: string;
  gradient?: string;

  // Metaphor (for AI generation)
  metaphor?: string;

  // Rendering primitives
  container: ContainerType;
  arrangement: ArrangementType;
  entityShape: ShapeType;
  connectionStyle: ConnectionType;
  decorations: DecorationConfig[];
  interactions: InteractionConfig[];
  transition: TransitionType;

  // Data binding
  filter?: DimensionFilter;
  sort?: DimensionSort;
  group?: DimensionGroup;

  // Visual mapping
  sizeMapping?: SizeMapping;
  colorMapping?: ColorMapping;

  // 3D specific (for graph arrangement)
  is3D?: boolean;
  cameraPosition?: { x: number; y: number; z: number };
  physicsEnabled?: boolean;

  // Layout specific (for grid/list arrangements)
  columns?: number;
  gap?: number;
  itemSize?: "sm" | "md" | "lg" | "auto";
}

// =============================================================================
// Preset Dimension Types
// =============================================================================

export type PresetDimensionId =
  | "feed"
  | "kanban"
  | "graph"
  | "graph-3d"
  | "calendar"
  | "grid"
  | "table"
  | "ipod"
  | "quest-log"
  | "skill-tree"
  | "agent-tasks";

export interface PresetDimension extends DimensionConfig {
  id: PresetDimensionId;
  isPreset: true;
  defaultFilter?: DimensionFilter;
}

// =============================================================================
// Graph Data for Visualization
// =============================================================================

export interface GraphNode {
  id: string;
  entity: Entity;
  x?: number;
  y?: number;
  z?: number;
  size?: number;
  color?: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relationship: Relationship;
  weight?: number;
  color?: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

// =============================================================================
// Dimension Context State
// =============================================================================

export interface DimensionState {
  activeDimensionId: string;
  activeConfig: DimensionConfig;
  entities: Entity[];
  relationships: Relationship[];
  graphData?: GraphData;
  loading: boolean;
  error?: string;
}

export interface DimensionActions {
  switchDimension: (dimensionId: string) => void;
  setFilter: (filter: DimensionFilter) => void;
  setSort: (sort: DimensionSort) => void;
  generateDimension: (metaphor: string) => Promise<DimensionConfig>;
  modifyActiveDimension: (updates: Partial<DimensionConfig>) => void;
  selectEntity: (entityId: string) => void;
}

// =============================================================================
// Metaphor Vocabulary (for AI dimension generation)
// =============================================================================

export interface MetaphorMapping {
  keywords: string[];
  arrangement: ArrangementType;
  entityShape: ShapeType;
  connectionStyle: ConnectionType;
  decorations: DecorationType[];
  specialConfig?: Partial<DimensionConfig>;
}

export const METAPHOR_VOCABULARY: Record<string, MetaphorMapping> = {
  garden: {
    keywords: ["garden", "grow", "bloom", "plant", "cultivate", "nurture"],
    arrangement: "grid",
    entityShape: "circle",
    connectionStyle: "curve",
    decorations: ["glow", "badge"],
    specialConfig: {
      sizeMapping: { field: "importance", min: 40, max: 120 },
    },
  },
  solar: {
    keywords: ["solar", "orbit", "planet", "sun", "satellite", "gravity"],
    arrangement: "orbit",
    entityShape: "circle",
    connectionStyle: "line",
    decorations: ["glow"],
    specialConfig: {
      is3D: true,
      physicsEnabled: true,
    },
  },
  ocean: {
    keywords: ["ocean", "sea", "depth", "wave", "swim", "dive"],
    arrangement: "flow",
    entityShape: "circle",
    connectionStyle: "curve",
    decorations: ["shadow"],
    specialConfig: {
      sizeMapping: { field: "age", min: 20, max: 100 },
    },
  },
  dungeon: {
    keywords: ["dungeon", "room", "clear", "boss", "quest", "adventure"],
    arrangement: "grid",
    entityShape: "square",
    connectionStyle: "line",
    decorations: ["border", "badge"],
    specialConfig: {
      columns: 5,
      gap: 4,
    },
  },
  vinyl: {
    keywords: ["vinyl", "record", "shelf", "album", "music", "spin"],
    arrangement: "flow",
    entityShape: "square",
    connectionStyle: "none",
    decorations: ["shadow"],
    specialConfig: {
      itemSize: "lg",
      gap: 8,
    },
  },
  constellation: {
    keywords: ["constellation", "star", "sky", "space", "cosmos"],
    arrangement: "graph",
    entityShape: "circle",
    connectionStyle: "glow",
    decorations: ["glow"],
    specialConfig: {
      is3D: true,
      physicsEnabled: true,
    },
  },
  city: {
    keywords: ["city", "street", "building", "architecture", "urban"],
    arrangement: "grid",
    entityShape: "square",
    connectionStyle: "line",
    decorations: ["shadow", "label"],
    specialConfig: {
      columns: 8,
    },
  },
  tree: {
    keywords: ["tree", "branch", "root", "hierarchy", "family"],
    arrangement: "tree",
    entityShape: "circle",
    connectionStyle: "curve",
    decorations: ["border"],
  },
};
