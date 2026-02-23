/**
 * Component Stability Registry
 *
 * Every component, feature, and API is tagged with a stability level.
 * Following Autoship principle: "Separate Exploration from Release Surface"
 *
 * Stability Levels:
 * - stable: Production ready, API locked, test coverage > 80%
 * - experimental: Feature complete but may change, use at own risk
 * - exploratory: Proof of concept, will likely change significantly
 *
 * @version 0.1.0
 * @since 2026-02-03
 */

// =============================================================================
// Types
// =============================================================================

export type StabilityLevel = "stable" | "experimental" | "exploratory";

export interface StabilityEntry {
  /** Stability level */
  level: StabilityLevel;

  /** When this stability was declared */
  since: string;

  /** Expected promotion date (for experimental/exploratory) */
  expectedPromotion?: string;

  /** Notes about stability status */
  notes?: string;

  /** Test coverage percentage (for stable components) */
  testCoverage?: number;

  /** Dependencies that must be stable first */
  dependsOn?: string[];

  /** Breaking changes in this version */
  breakingChanges?: string[];
}

export interface StabilityRegistry {
  version: string;
  updatedAt: string;
  components: Record<string, StabilityEntry>;
  features: Record<string, StabilityEntry>;
  apis: Record<string, StabilityEntry>;
  hooks: Record<string, StabilityEntry>;
  tools: Record<string, StabilityEntry>;
}

// =============================================================================
// Registry Definition
// =============================================================================

export const STABILITY_REGISTRY: StabilityRegistry = {
  version: "0.1.0",
  updatedAt: "2026-02-03",

  // ============================================================================
  // Components
  // ============================================================================
  components: {
    // ERV Components - Core
    "erv/EntityCard": {
      level: "stable",
      since: "2026-01-20",
      testCoverage: 85,
      notes: "Core entity display component, used across all dimensions",
    },
    "erv/DimensionHeader": {
      level: "stable",
      since: "2026-01-20",
      testCoverage: 80,
      notes: "Navigation header with breadcrumbs",
    },
    "erv/DimensionRenderer": {
      level: "experimental",
      since: "2026-01-25",
      notes: "7 arrangements implemented, physics simulation needs optimization",
      dependsOn: ["erv/EntityCard", "erv/Connection"],
    },
    "erv/Connection": {
      level: "stable",
      since: "2026-01-22",
      testCoverage: 82,
      notes: "SVG relationship visualization",
    },
    "erv/DimensionPortal": {
      level: "exploratory",
      since: "2026-01-28",
      notes: "Matrix-bending transition effects, needs performance testing",
    },

    // iOS Components
    "ios/HomeScreen": {
      level: "stable",
      since: "2025-12-15",
      testCoverage: 75,
      notes: "Main entry point, iOS-style home screen",
    },
    "ios/LockScreen": {
      level: "stable",
      since: "2025-12-15",
      notes: "Animated lock screen with time display",
    },
    "ios/Dock": {
      level: "stable",
      since: "2025-12-15",
      notes: "App dock with context-aware visibility",
    },

    // 8gent Components
    "claw-ai/ChatInterface": {
      level: "stable",
      since: "2026-01-10",
      notes: "Main chat interface with tool execution",
    },
    "claw-ai/ToolExecution": {
      level: "stable",
      since: "2026-01-10",
      notes: "Tool result rendering in chat",
    },
    "claw-ai/VoiceInput": {
      level: "experimental",
      since: "2026-01-15",
      notes: "Speech-to-text with silence detection",
    },

    // Auth Components
    "auth/OwnerGate": {
      level: "stable",
      since: "2026-01-30",
      notes: "Owner-only access wrapper",
    },
    "auth/AgentAccessRestricted": {
      level: "stable",
      since: "2026-01-30",
      notes: "Graceful rejection for non-owners",
    },
    "auth/GitHubAuthModal": {
      level: "stable",
      since: "2026-01-30",
      notes: "GitHub OAuth modal for sandbox",
    },

    // Canvas Components
    "canvas/InfiniteCanvas": {
      level: "experimental",
      since: "2026-01-25",
      notes: "Infinite design canvas with AI generation",
      dependsOn: ["canvas/CanvasToolbar", "canvas/CanvasNode"],
    },
    "canvas/CanvasNode": {
      level: "experimental",
      since: "2026-01-25",
      notes: "Multi-type canvas node (text, image, shape, AI)",
    },
    "canvas/CanvasToolbar": {
      level: "stable",
      since: "2026-01-25",
      notes: "Toolbar for canvas operations",
    },

    // Agent Components
    "agent/AgentSidebar": {
      level: "exploratory",
      since: "2026-01-28",
      notes: "OpenClaw sidebar with job tracking",
      dependsOn: ["agent/ContextBar"],
    },
    "agent/ContextBar": {
      level: "exploratory",
      since: "2026-01-28",
      notes: "Working context display",
    },
    "agent/CodePanel": {
      level: "exploratory",
      since: "2026-01-28",
      notes: "Code editor panel for OpenClaw",
    },
  },

  // ============================================================================
  // Features
  // ============================================================================
  features: {
    "erv-architecture": {
      level: "experimental",
      since: "2026-01-20",
      notes: "Entity-Relationship-View architecture for infinite dimensions",
      expectedPromotion: "v0.2.0",
    },
    "dimension-presets": {
      level: "stable",
      since: "2026-01-20",
      notes: "9 preset dimensions: feed, kanban, graph, calendar, grid, etc.",
    },
    "view-contract": {
      level: "experimental",
      since: "2026-02-03",
      notes: "Formal ViewDescriptor contract for view compilation",
      dependsOn: ["erv-architecture"],
    },
    "mutation-gateway": {
      level: "experimental",
      since: "2026-02-03",
      notes: "Centralized mutation layer with audit logging",
      dependsOn: ["erv-architecture"],
    },
    "recursive-memory-layer": {
      level: "stable",
      since: "2026-01-15",
      notes: "Episodic + semantic memory for 8gent",
    },
    "bmad-product-lifecycle": {
      level: "stable",
      since: "2026-01-10",
      notes: "Full agentic product management",
    },
    "voice-interaction": {
      level: "experimental",
      since: "2026-01-15",
      notes: "Two-way voice chat with 8gent",
    },
    "sandbox-integration": {
      level: "experimental",
      since: "2026-01-28",
      notes: "Vercel Sandbox for code execution",
    },
    "github-auth-cloning": {
      level: "stable",
      since: "2026-01-31",
      notes: "Clone private repos with GitHub OAuth",
    },
    "constellation-arrangement": {
      level: "exploratory",
      since: "2026-01-28",
      notes: "3D star constellation view, needs Three.js renderer",
    },
    "ai-dimension-generation": {
      level: "exploratory",
      since: "2026-01-25",
      notes: "Generate dimensions from metaphor descriptions",
    },
    "working-context-persistence": {
      level: "exploratory",
      since: "2026-01-28",
      notes: "Persist agent working context across sessions",
    },
    "omnichannel-messaging": {
      level: "experimental",
      since: "2026-01-27",
      notes: "WhatsApp, SMS integration with 8gent",
    },
    "security-dashboard": {
      level: "stable",
      since: "2026-01-20",
      notes: "Fortress-level security monitoring",
    },
  },

  // ============================================================================
  // APIs
  // ============================================================================
  apis: {
    "/api/chat": {
      level: "stable",
      since: "2026-01-01",
      notes: "Main chat API with full tool support",
    },
    "/api/chat/stream": {
      level: "stable",
      since: "2026-01-15",
      notes: "Streaming chat with SSE",
    },
    "/api/chat/compact": {
      level: "stable",
      since: "2026-01-20",
      notes: "Conversation compaction with memory extraction",
    },
    "/api/sandbox": {
      level: "experimental",
      since: "2026-01-28",
      notes: "Vercel Sandbox API for code execution",
    },
    "/api/cron/*": {
      level: "stable",
      since: "2026-01-15",
      notes: "Scheduled job APIs",
    },
    "/api/security/*": {
      level: "stable",
      since: "2026-01-20",
      notes: "Security monitoring APIs",
    },
    "/api/webhooks/whatsapp": {
      level: "experimental",
      since: "2026-01-27",
      notes: "WhatsApp webhook handler",
    },
  },

  // ============================================================================
  // Hooks
  // ============================================================================
  hooks: {
    "useDimension": {
      level: "stable",
      since: "2026-01-20",
      notes: "Access dimension state and actions",
    },
    "useDimensionKeyboardShortcuts": {
      level: "stable",
      since: "2026-01-20",
      notes: "Cmd/Ctrl+1-9 dimension switching",
    },
    "useAgenticActions": {
      level: "stable",
      since: "2026-01-15",
      notes: "Bridge AI tool responses to Convex mutations",
    },
    "useStreamingChat": {
      level: "stable",
      since: "2026-01-15",
      notes: "SSE streaming chat hook",
    },
    "useSpeechRecognition": {
      level: "experimental",
      since: "2026-01-15",
      notes: "Browser speech-to-text",
    },
    "useTextToSpeech": {
      level: "stable",
      since: "2026-01-15",
      notes: "OpenAI TTS integration",
    },
    "useVoiceChat": {
      level: "experimental",
      since: "2026-01-15",
      notes: "Combined voice conversation",
    },
    "useAgentSandbox": {
      level: "exploratory",
      since: "2026-01-28",
      notes: "Agent-specific sandbox operations",
    },
    "useWorkingContext": {
      level: "exploratory",
      since: "2026-01-28",
      notes: "OpenClaw working context state",
    },
    "useCodingTask": {
      level: "exploratory",
      since: "2026-01-28",
      notes: "Coding task management",
    },
  },

  // ============================================================================
  // AI Tools
  // ============================================================================
  tools: {
    // Portfolio Tools
    "search_portfolio": {
      level: "stable",
      since: "2025-12-15",
      notes: "Search portfolio projects, skills, experience",
    },
    "navigate_to": {
      level: "stable",
      since: "2025-12-15",
      notes: "Navigate to pages",
    },
    "list_themes": {
      level: "stable",
      since: "2025-12-15",
      notes: "Display theme options",
    },

    // Scheduling Tools
    "schedule_call": {
      level: "stable",
      since: "2026-01-10",
      notes: "Open Calendly booking",
    },
    "get_available_times": {
      level: "stable",
      since: "2026-01-10",
      notes: "Query available slots",
    },
    "book_meeting": {
      level: "stable",
      since: "2026-01-10",
      notes: "Create meeting",
    },

    // Memory Tools
    "remember": {
      level: "stable",
      since: "2026-01-15",
      notes: "Search episodic memories",
    },
    "memorize": {
      level: "stable",
      since: "2026-01-15",
      notes: "Store episodic memory",
    },
    "learn": {
      level: "stable",
      since: "2026-01-15",
      notes: "Create/update semantic knowledge",
    },
    "forget": {
      level: "stable",
      since: "2026-01-15",
      notes: "Delete memories",
    },

    // Product Tools
    "create_project": {
      level: "stable",
      since: "2026-01-10",
      notes: "Create product project",
    },
    "create_prd": {
      level: "stable",
      since: "2026-01-10",
      notes: "Generate PRD",
    },
    "create_ticket": {
      level: "stable",
      since: "2026-01-10",
      notes: "Create BMAD ticket",
    },
    "shard_prd": {
      level: "stable",
      since: "2026-01-10",
      notes: "Convert PRD to epics/tickets",
    },

    // Coding Tools
    "clone_repo": {
      level: "experimental",
      since: "2026-01-28",
      notes: "Clone repository with GitHub auth",
    },
    "run_command": {
      level: "experimental",
      since: "2026-01-28",
      notes: "Execute terminal commands",
    },
    "read_file": {
      level: "experimental",
      since: "2026-01-28",
      notes: "Read file from sandbox",
    },
    "write_file": {
      level: "experimental",
      since: "2026-01-28",
      notes: "Write file to sandbox",
    },

    // Dimension Tools
    "create_dimension": {
      level: "experimental",
      since: "2026-01-25",
      notes: "Create custom dimension",
    },
    "navigate_dimension": {
      level: "experimental",
      since: "2026-01-25",
      notes: "Navigate to dimension",
    },

    // Canvas Tools
    "create_canvas": {
      level: "experimental",
      since: "2026-01-25",
      notes: "Create design canvas",
    },
    "generate_on_canvas": {
      level: "experimental",
      since: "2026-01-25",
      notes: "AI generation on canvas",
    },

    // Channel Tools
    "send_channel_message": {
      level: "experimental",
      since: "2026-01-27",
      notes: "Send message to channel",
    },
    "compact_conversation": {
      level: "experimental",
      since: "2026-01-27",
      notes: "Compact conversation with summary",
    },
  },
};

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Get stability entry for a component.
 */
export function getComponentStability(name: string): StabilityEntry | undefined {
  return STABILITY_REGISTRY.components[name];
}

/**
 * Get stability entry for a feature.
 */
export function getFeatureStability(name: string): StabilityEntry | undefined {
  return STABILITY_REGISTRY.features[name];
}

/**
 * Get stability entry for an API.
 */
export function getApiStability(path: string): StabilityEntry | undefined {
  return STABILITY_REGISTRY.apis[path];
}

/**
 * Get stability entry for a hook.
 */
export function getHookStability(name: string): StabilityEntry | undefined {
  return STABILITY_REGISTRY.hooks[name];
}

/**
 * Get stability entry for a tool.
 */
export function getToolStability(name: string): StabilityEntry | undefined {
  return STABILITY_REGISTRY.tools[name];
}

/**
 * Check if something is stable.
 */
export function isStable(
  category: "components" | "features" | "apis" | "hooks" | "tools",
  name: string
): boolean {
  const entry = STABILITY_REGISTRY[category][name];
  return entry?.level === "stable";
}

/**
 * Get all items by stability level.
 */
export function getByStabilityLevel(level: StabilityLevel): {
  components: string[];
  features: string[];
  apis: string[];
  hooks: string[];
  tools: string[];
} {
  return {
    components: Object.entries(STABILITY_REGISTRY.components)
      .filter(([, v]) => v.level === level)
      .map(([k]) => k),
    features: Object.entries(STABILITY_REGISTRY.features)
      .filter(([, v]) => v.level === level)
      .map(([k]) => k),
    apis: Object.entries(STABILITY_REGISTRY.apis)
      .filter(([, v]) => v.level === level)
      .map(([k]) => k),
    hooks: Object.entries(STABILITY_REGISTRY.hooks)
      .filter(([, v]) => v.level === level)
      .map(([k]) => k),
    tools: Object.entries(STABILITY_REGISTRY.tools)
      .filter(([, v]) => v.level === level)
      .map(([k]) => k),
  };
}

/**
 * Get stability summary stats.
 */
export function getStabilitySummary(): {
  stable: number;
  experimental: number;
  exploratory: number;
  total: number;
} {
  const all = [
    ...Object.values(STABILITY_REGISTRY.components),
    ...Object.values(STABILITY_REGISTRY.features),
    ...Object.values(STABILITY_REGISTRY.apis),
    ...Object.values(STABILITY_REGISTRY.hooks),
    ...Object.values(STABILITY_REGISTRY.tools),
  ];

  return {
    stable: all.filter(e => e.level === "stable").length,
    experimental: all.filter(e => e.level === "experimental").length,
    exploratory: all.filter(e => e.level === "exploratory").length,
    total: all.length,
  };
}

/**
 * Validate that dependencies are at least as stable as the dependent.
 */
export function validateDependencies(): string[] {
  const errors: string[] = [];

  const checkDeps = (
    category: "components" | "features",
    name: string,
    entry: StabilityEntry
  ) => {
    if (!entry.dependsOn) return;

    const levelOrder: Record<StabilityLevel, number> = {
      stable: 2,
      experimental: 1,
      exploratory: 0,
    };

    for (const dep of entry.dependsOn) {
      // Check in same category first
      const depEntry = STABILITY_REGISTRY[category][dep] ||
                       STABILITY_REGISTRY.components[dep] ||
                       STABILITY_REGISTRY.features[dep];

      if (!depEntry) {
        errors.push(`${category}/${name}: dependency "${dep}" not found in registry`);
        continue;
      }

      if (levelOrder[depEntry.level] < levelOrder[entry.level]) {
        errors.push(
          `${category}/${name} (${entry.level}) depends on ${dep} (${depEntry.level})`
        );
      }
    }
  };

  for (const [name, entry] of Object.entries(STABILITY_REGISTRY.components)) {
    checkDeps("components", name, entry);
  }

  for (const [name, entry] of Object.entries(STABILITY_REGISTRY.features)) {
    checkDeps("features", name, entry);
  }

  return errors;
}
