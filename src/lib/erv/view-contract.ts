/**
 * ERV View Contract
 *
 * Formal, versioned ViewDescriptor contract following Autoship discipline.
 * This turns dimensions from "renderers" into "compilers".
 *
 * Principle: "Plans before execution"
 * - Every view must be explicitly described before rendering
 * - No ad-hoc config objects
 * - DimensionRenderer only accepts compiled views
 *
 * @version 0.1.0
 * @since 2026-02-03
 */

import type {
  EntityType,
  RelationshipType,
  ArrangementType,
  ContainerType,
  ShapeType,
  ConnectionType,
  DecorationType,
  InteractionType,
  TransitionType,
  DimensionConfig,
  DimensionFilter,
  DimensionSort,
  Entity,
  Relationship,
} from "./types";

// =============================================================================
// Contract Version
// =============================================================================

export const VIEW_CONTRACT_VERSION = "0.1.0" as const;

// =============================================================================
// Stability Markers (Autoship Pattern: Separate Exploration from Release)
// =============================================================================

export type StabilityLevel = "stable" | "experimental" | "exploratory";

export interface StabilityMarker {
  level: StabilityLevel;
  since: string; // ISO date when stability was declared
  notes?: string;
}

// =============================================================================
// Data Source Contract
// =============================================================================

/**
 * Defines what data a view needs.
 * This is the "input contract" - what entities and relationships to fetch.
 */
export interface DataSourceContract {
  /** Which entity types this view displays */
  entityTypes: EntityType[];

  /** Which relationship types to include (for graph/tree views) */
  relationshipTypes?: RelationshipType[];

  /** Whether relationships are required for this view */
  requiresRelationships: boolean;

  /** Minimum entities needed to render (0 = show empty state) */
  minEntities?: number;

  /** Maximum entities to load (pagination hint) */
  maxEntities?: number;

  /** Data freshness requirement in milliseconds (for caching) */
  maxAge?: number;
}

// =============================================================================
// Filter Contract
// =============================================================================

/**
 * Immutable filter specification.
 * Once compiled, filters cannot be modified without recompilation.
 */
export interface FilterContract extends DimensionFilter {
  /** Whether filter is user-modifiable at runtime */
  readonly locked: boolean;

  /** Default values for optional filters */
  readonly defaults?: Partial<DimensionFilter>;
}

// =============================================================================
// Arrangement Contract
// =============================================================================

/**
 * How entities are spatially arranged.
 * Each arrangement type has specific requirements and guarantees.
 */
export interface ArrangementContract {
  type: ArrangementType;

  /** Grid-specific */
  columns?: number;
  gap?: number;

  /** Tree-specific */
  rootEntityType?: EntityType;
  hierarchyRelationship?: RelationshipType;

  /** Graph-specific */
  physicsEnabled?: boolean;
  forceStrength?: number;
  linkDistance?: number;

  /** Orbit-specific */
  centerEntityId?: string;
  orbitLayers?: number;

  /** Layout constraints */
  minItemSize?: number;
  maxItemSize?: number;
  maintainAspectRatio?: boolean;
}

// =============================================================================
// Layout Rules Contract
// =============================================================================

/**
 * Layout rules define responsive behavior and sizing.
 */
export interface LayoutRulesContract {
  /** Container type affects padding and borders */
  container: ContainerType;

  /** Item size preference */
  itemSize: "sm" | "md" | "lg" | "auto";

  /** Responsive breakpoints */
  responsive?: {
    mobile?: Partial<ArrangementContract>;
    tablet?: Partial<ArrangementContract>;
    desktop?: Partial<ArrangementContract>;
  };

  /** Whether to show scroll indicators */
  showScrollIndicators?: boolean;

  /** Maximum height before scrolling (CSS value) */
  maxHeight?: string;

  /** Density preference */
  density?: "compact" | "comfortable" | "spacious";
}

// =============================================================================
// Interaction Rules Contract
// =============================================================================

/**
 * Defines allowed interactions and their handlers.
 * This is the "permission" layer for user actions.
 */
export interface InteractionRulesContract {
  /** Allowed interaction types */
  allowedInteractions: InteractionType[];

  /** Click behavior */
  onClick?: "select" | "navigate" | "edit" | "preview" | "reveal" | "none";

  /** Long press behavior */
  onLongPress?: "contextMenu" | "drag" | "edit" | "none";

  /** Drag behavior */
  drag?: {
    enabled: boolean;
    /** Can items be reordered? */
    reorderable?: boolean;
    /** Can items be dragged to other views? */
    transferable?: boolean;
    /** Drop zones */
    dropTargets?: string[];
  };

  /** Keyboard navigation */
  keyboard?: {
    enabled: boolean;
    /** Arrow key navigation pattern */
    pattern?: "grid" | "list" | "tree";
    /** Shortcuts */
    shortcuts?: Record<string, string>; // key -> action
  };

  /** Selection mode */
  selection?: {
    mode: "none" | "single" | "multiple";
    /** Can selection persist across view changes? */
    persistent?: boolean;
  };
}

// =============================================================================
// Mutation Permissions Contract
// =============================================================================

/**
 * What mutations are allowed from this view.
 * Follows "Thin Intelligence, Thick System" - mutations go through gateway.
 */
export interface MutationPermissionsContract {
  /** Can entities be created from this view? */
  canCreate: boolean;
  createEntityTypes?: EntityType[];

  /** Can entities be updated from this view? */
  canUpdate: boolean;
  updatableFields?: string[];

  /** Can entities be deleted from this view? */
  canDelete: boolean;

  /** Can relationships be created/modified? */
  canModifyRelationships: boolean;

  /** Required confirmation for destructive actions */
  requireConfirmation?: ("delete" | "archive" | "bulkUpdate")[];

  /** Access level required (maps to user role) */
  requiredAccessLevel: "owner" | "collaborator" | "visitor";
}

// =============================================================================
// Accessibility Contract
// =============================================================================

/**
 * Accessibility requirements and hints.
 * Non-optional - every view must define accessibility behavior.
 */
export interface AccessibilityContract {
  /** ARIA role for the container */
  role: "grid" | "list" | "tree" | "listbox" | "region" | "application";

  /** ARIA label for the view */
  label: string;

  /** Live region behavior for updates */
  liveRegion?: "off" | "polite" | "assertive";

  /** Focus management strategy */
  focusManagement: "roving" | "activedescendant" | "manual";

  /** Minimum touch target size (px) */
  minTouchTarget: number;

  /** High contrast mode support */
  supportsHighContrast: boolean;

  /** Screen reader announcements */
  announcements?: {
    onLoad?: string;
    onEmpty?: string;
    onError?: string;
    onSelection?: string;
  };
}

// =============================================================================
// Motion Contract
// =============================================================================

/**
 * Animation and motion preferences.
 * Must respect prefers-reduced-motion.
 */
export interface MotionContract {
  /** Transition type between states */
  transition: TransitionType;

  /** Entry animation for items */
  entryAnimation?: "fade" | "scale" | "slide" | "none";

  /** Exit animation for items */
  exitAnimation?: "fade" | "scale" | "slide" | "none";

  /** Stagger delay for multiple items (ms) */
  staggerDelay?: number;

  /** Spring configuration preset */
  springPreset?: "smooth" | "snappy" | "bouncy" | "gentle";

  /** Respect prefers-reduced-motion (must be true) */
  respectReducedMotion: true;

  /** Fallback for reduced motion */
  reducedMotionFallback?: {
    transition: "none" | "fade";
    duration: number;
  };
}

// =============================================================================
// Visual Style Contract
// =============================================================================

/**
 * Visual styling that can be applied consistently.
 */
export interface VisualStyleContract {
  /** Entity shape */
  entityShape: ShapeType;

  /** Connection style */
  connectionStyle: ConnectionType;

  /** Decorations to apply */
  decorations: {
    type: DecorationType;
    condition?: string;
    value?: string | number;
  }[];

  /** Size mapping (for importance, etc.) */
  sizeMapping?: {
    field: string;
    min: number;
    max: number;
  };

  /** Color mapping */
  colorMapping?: {
    field: string;
    palette: Record<string, string>;
  };

  /** Icon override */
  icon?: string;

  /** Gradient for header/background */
  gradient?: string;
}

// =============================================================================
// The View Descriptor (Complete Contract)
// =============================================================================

/**
 * ViewDescriptor is the complete, compiled contract for a view.
 *
 * This is what DimensionRenderer accepts. No ad-hoc configs.
 * If it's not in the ViewDescriptor, it doesn't happen.
 */
export interface ViewDescriptor {
  /** Contract version for compatibility checking */
  readonly contractVersion: typeof VIEW_CONTRACT_VERSION;

  /** Unique identifier for this view */
  readonly id: string;

  /** Human-readable name */
  readonly name: string;

  /** Description for UI and accessibility */
  readonly description: string;

  /** Stability level */
  readonly stability: StabilityMarker;

  /** Data source specification */
  readonly dataSource: DataSourceContract;

  /** Filter configuration */
  readonly filter: FilterContract;

  /** Sort configuration */
  readonly sort: DimensionSort;

  /** Arrangement specification */
  readonly arrangement: ArrangementContract;

  /** Layout rules */
  readonly layout: LayoutRulesContract;

  /** Interaction rules */
  readonly interactions: InteractionRulesContract;

  /** Mutation permissions */
  readonly mutations: MutationPermissionsContract;

  /** Accessibility requirements */
  readonly accessibility: AccessibilityContract;

  /** Motion/animation preferences */
  readonly motion: MotionContract;

  /** Visual styling */
  readonly style: VisualStyleContract;

  /** Metadata for tracking */
  readonly metadata: {
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    checksum?: string; // For cache invalidation
  };
}

// =============================================================================
// User Preferences (Compile-Time Constraints)
// =============================================================================

/**
 * User preferences that influence view compilation.
 * These are NOT optional hints - they are constraints that MUST be applied.
 */
export interface UserPreferences {
  /** Motion preference */
  motion: {
    reducedMotion: boolean;
    animationSpeed: "slow" | "normal" | "fast";
  };

  /** Density preference */
  density: "compact" | "comfortable" | "spacious";

  /** Accessibility needs */
  accessibility: {
    highContrast: boolean;
    largeText: boolean;
    screenReader: boolean;
  };

  /** Color preferences */
  color: {
    colorBlindMode?: "protanopia" | "deuteranopia" | "tritanopia";
    preferDarkMode: boolean;
  };

  /** Interaction preferences */
  interaction: {
    preferKeyboard: boolean;
    hapticFeedback: boolean;
  };
}

// =============================================================================
// Compiled View (Output of Compiler)
// =============================================================================

/**
 * CompiledView is the result of compiling a ViewDescriptor with UserPreferences.
 * This is the final, ready-to-render specification.
 */
export interface CompiledView {
  /** The original descriptor (immutable) */
  readonly descriptor: ViewDescriptor;

  /** Applied user preferences */
  readonly appliedPreferences: UserPreferences;

  /** Compilation timestamp */
  readonly compiledAt: string;

  /** Resolved values after applying preferences */
  readonly resolved: {
    /** Final motion settings */
    motion: {
      enabled: boolean;
      transition: TransitionType | "none";
      duration: number;
      spring: Record<string, number>;
    };

    /** Final layout settings */
    layout: {
      itemSize: number;
      gap: number;
      columns: number;
      minTouchTarget: number;
    };

    /** Final accessibility settings */
    accessibility: {
      role: string;
      label: string;
      announcements: Record<string, string>;
    };
  };
}

// =============================================================================
// View Compiler Function
// =============================================================================

/**
 * Compiles a ViewDescriptor with UserPreferences into a CompiledView.
 *
 * This is the core of "Preferences as Compile-Time Constraints".
 * Preferences are not optional hints - they are enforced at compile time.
 */
export function compileView(
  descriptor: ViewDescriptor,
  preferences: UserPreferences
): CompiledView {
  // Validate contract version
  if (descriptor.contractVersion !== VIEW_CONTRACT_VERSION) {
    throw new Error(
      `Contract version mismatch: expected ${VIEW_CONTRACT_VERSION}, got ${descriptor.contractVersion}`
    );
  }

  // Apply motion preferences
  const motionEnabled = !preferences.motion.reducedMotion;
  const motionDuration = preferences.motion.animationSpeed === "slow" ? 400 :
    preferences.motion.animationSpeed === "fast" ? 150 : 250;

  // Apply density preferences
  const densityMultiplier = preferences.density === "compact" ? 0.75 :
    preferences.density === "spacious" ? 1.5 : 1;

  const baseItemSize = descriptor.layout.itemSize === "sm" ? 48 :
    descriptor.layout.itemSize === "lg" ? 96 : 64;

  // Apply accessibility preferences
  const minTouchTarget = preferences.accessibility.largeText ?
    Math.max(descriptor.accessibility.minTouchTarget, 56) :
    descriptor.accessibility.minTouchTarget;

  // Resolve spring configuration
  const springPresets: Record<string, Record<string, number>> = {
    smooth: { stiffness: 200, damping: 25, mass: 1 },
    snappy: { stiffness: 400, damping: 30, mass: 0.8 },
    bouncy: { stiffness: 300, damping: 15, mass: 1 },
    gentle: { stiffness: 100, damping: 20, mass: 1.2 },
  };

  const spring = springPresets[descriptor.motion.springPreset || "smooth"];

  return {
    descriptor,
    appliedPreferences: preferences,
    compiledAt: new Date().toISOString(),
    resolved: {
      motion: {
        enabled: motionEnabled,
        transition: motionEnabled ? descriptor.motion.transition : "none",
        duration: motionDuration,
        spring,
      },
      layout: {
        itemSize: Math.round(baseItemSize * densityMultiplier),
        gap: Math.round((descriptor.arrangement.gap || 16) * densityMultiplier),
        columns: descriptor.arrangement.columns || 4,
        minTouchTarget,
      },
      accessibility: {
        role: descriptor.accessibility.role,
        label: descriptor.accessibility.label,
        announcements: descriptor.accessibility.announcements || {},
      },
    },
  };
}

// =============================================================================
// Conversion Utilities
// =============================================================================

/**
 * Converts legacy DimensionConfig to ViewDescriptor.
 * This allows gradual migration of existing code.
 */
export function dimensionConfigToDescriptor(
  config: DimensionConfig,
  options?: {
    stability?: StabilityLevel;
    accessLevel?: "owner" | "collaborator" | "visitor";
    createdBy?: string;
  }
): ViewDescriptor {
  const now = new Date().toISOString();

  return {
    contractVersion: VIEW_CONTRACT_VERSION,
    id: config.id,
    name: config.name,
    description: config.description || `View: ${config.name}`,
    stability: {
      level: options?.stability || "experimental",
      since: now,
    },
    dataSource: {
      entityTypes: config.filter?.entityTypes || [],
      requiresRelationships: config.arrangement === "graph" || config.arrangement === "tree",
      relationshipTypes: config.arrangement === "graph" || config.arrangement === "tree"
        ? ["relatedTo", "parentOf", "contains"]
        : undefined,
    },
    filter: {
      ...config.filter,
      locked: false,
      defaults: config.filter,
    },
    sort: config.sort || { field: "createdAt", direction: "desc" },
    arrangement: {
      type: config.arrangement,
      columns: config.columns,
      gap: config.gap,
      physicsEnabled: config.physicsEnabled,
    },
    layout: {
      container: config.container,
      itemSize: config.itemSize || "md",
    },
    interactions: {
      allowedInteractions: config.interactions?.map(i => i.type) || ["click", "hover"],
      onClick: "navigate",
      selection: { mode: "single", persistent: false },
      keyboard: { enabled: true, pattern: config.arrangement === "grid" ? "grid" : "list" },
    },
    mutations: {
      canCreate: true,
      canUpdate: true,
      canDelete: true,
      canModifyRelationships: true,
      requiredAccessLevel: options?.accessLevel || "owner",
    },
    accessibility: {
      role: config.arrangement === "grid" ? "grid" : "list",
      label: config.name,
      focusManagement: "roving",
      minTouchTarget: 44,
      supportsHighContrast: true,
    },
    motion: {
      transition: config.transition,
      entryAnimation: "fade",
      staggerDelay: 50,
      springPreset: "smooth",
      respectReducedMotion: true,
      reducedMotionFallback: { transition: "fade", duration: 150 },
    },
    style: {
      entityShape: config.entityShape,
      connectionStyle: config.connectionStyle,
      decorations: config.decorations,
      sizeMapping: config.sizeMapping,
      colorMapping: config.colorMapping,
      icon: config.icon,
      gradient: config.gradient,
    },
    metadata: {
      createdAt: now,
      updatedAt: now,
      createdBy: options?.createdBy || "system",
    },
  };
}

/**
 * Validates a ViewDescriptor against the contract.
 * Returns array of validation errors (empty if valid).
 */
export function validateViewDescriptor(descriptor: ViewDescriptor): string[] {
  const errors: string[] = [];

  // Version check
  if (descriptor.contractVersion !== VIEW_CONTRACT_VERSION) {
    errors.push(`Invalid contract version: ${descriptor.contractVersion}`);
  }

  // Required fields
  if (!descriptor.id) errors.push("Missing required field: id");
  if (!descriptor.name) errors.push("Missing required field: name");
  if (!descriptor.dataSource) errors.push("Missing required field: dataSource");
  if (!descriptor.accessibility) errors.push("Missing required field: accessibility");
  if (!descriptor.motion) errors.push("Missing required field: motion");

  // Motion contract
  if (descriptor.motion && !descriptor.motion.respectReducedMotion) {
    errors.push("motion.respectReducedMotion must be true");
  }

  // Accessibility contract
  if (descriptor.accessibility) {
    if (descriptor.accessibility.minTouchTarget < 44) {
      errors.push("accessibility.minTouchTarget must be at least 44px");
    }
    if (!descriptor.accessibility.label) {
      errors.push("accessibility.label is required");
    }
  }

  // Data source contract
  if (descriptor.dataSource) {
    if (descriptor.dataSource.entityTypes.length === 0 &&
        !descriptor.filter?.search) {
      errors.push("dataSource.entityTypes cannot be empty unless search filter is used");
    }
  }

  // Arrangement-specific validations
  if (descriptor.arrangement.type === "graph" || descriptor.arrangement.type === "tree") {
    if (!descriptor.dataSource.requiresRelationships) {
      errors.push(`${descriptor.arrangement.type} arrangement requires relationships`);
    }
  }

  return errors;
}

// =============================================================================
// Default User Preferences
// =============================================================================

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  motion: {
    reducedMotion: false,
    animationSpeed: "normal",
  },
  density: "comfortable",
  accessibility: {
    highContrast: false,
    largeText: false,
    screenReader: false,
  },
  color: {
    preferDarkMode: true,
  },
  interaction: {
    preferKeyboard: false,
    hapticFeedback: true,
  },
};

// =============================================================================
// Type Guards
// =============================================================================

export function isViewDescriptor(obj: unknown): obj is ViewDescriptor {
  if (typeof obj !== "object" || obj === null) return false;
  const descriptor = obj as ViewDescriptor;
  return (
    descriptor.contractVersion === VIEW_CONTRACT_VERSION &&
    typeof descriptor.id === "string" &&
    typeof descriptor.name === "string" &&
    typeof descriptor.dataSource === "object" &&
    typeof descriptor.accessibility === "object" &&
    typeof descriptor.motion === "object"
  );
}

export function isCompiledView(obj: unknown): obj is CompiledView {
  if (typeof obj !== "object" || obj === null) return false;
  const compiled = obj as CompiledView;
  return (
    isViewDescriptor(compiled.descriptor) &&
    typeof compiled.compiledAt === "string" &&
    typeof compiled.resolved === "object"
  );
}
