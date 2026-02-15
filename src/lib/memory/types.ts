/**
 * Memory Layer Types
 *
 * Type definitions for the RLM (Recursive Memory Layer) system.
 * @see docs/planning/recursive-memory-layer-scope.md
 */

// import { Id } from "../../../convex/_generated/dataModel";
import { Id } from "../convex-shim";

// ============================================================================
// EPISODIC MEMORY
// ============================================================================

export type EpisodicMemoryType =
  | "interaction"
  | "decision"
  | "preference"
  | "feedback"
  | "milestone";

export interface EpisodicMemory {
  _id: Id<"episodicMemories">;
  userId: string;
  projectId?: Id<"productProjects">;
  content: string;
  embedding?: number[];
  memoryType: EpisodicMemoryType;
  importance: number;
  timestamp: number;
  metadata?: {
    toolsUsed?: string[];
    outcome?: string;
    relatedMemories?: Id<"episodicMemories">[];
  };
}

export interface EpisodicMemoryInput {
  userId: string;
  projectId?: Id<"productProjects">;
  content: string;
  memoryType: EpisodicMemoryType;
  importance: number;
  metadata?: {
    toolsUsed?: string[];
    outcome?: string;
  };
}

// ============================================================================
// SEMANTIC MEMORY
// ============================================================================

export type SemanticCategory = "preference" | "skill" | "pattern" | "fact";

export interface SemanticMemory {
  _id: Id<"semanticMemories">;
  userId: string;
  category: SemanticCategory;
  key: string;
  value: string;
  confidence: number;
  source: string;
  accessCount: number;
  lastAccessed: number;
  createdAt: number;
  updatedAt: number;
}

export interface SemanticMemoryInput {
  userId: string;
  category: SemanticCategory;
  key: string;
  value: string;
  confidence: number;
  source: string;
}

// ============================================================================
// WORKING MEMORY
// ============================================================================

export interface WorkingMemory {
  _id: Id<"workingMemory">;
  sessionId: string;
  userId: string;
  relevantEpisodicIds: Id<"episodicMemories">[];
  relevantSemanticIds: Id<"semanticMemories">[];
  contextSummary: string;
  currentTask?: string;
  createdAt: number;
  expiresAt: number;
}

// ============================================================================
// MEMORY SEARCH & RETRIEVAL
// ============================================================================

export interface MemorySearchOptions {
  projectId?: Id<"productProjects">;
  limit?: number;
  includeEpisodic?: boolean;
  includeSemantic?: boolean;
}

export interface MemorySearchResult {
  episodic: EpisodicMemory[];
  semantic: SemanticMemory[];
  contextSummary: string;
}

// ============================================================================
// INTERACTION PROCESSING
// ============================================================================

export interface Interaction {
  userMessage: string;
  aiResponse: string;
  toolsUsed: string[];
}

export interface ExtractedPattern {
  category: SemanticCategory;
  key: string;
  value: string;
  confidence: number;
}

// ============================================================================
// MEMORY STATS
// ============================================================================

export interface MemoryStats {
  episodicCount: number;
  semanticCount: number;
  activeWorkingSessions: number;
  episodicByType: Record<EpisodicMemoryType, number>;
  semanticByCategory: Record<SemanticCategory, number>;
  avgEpisodicImportance: number;
  avgSemanticConfidence: number;
}
