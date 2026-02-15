/**
 * Memory Layer Type Tests
 *
 * Tests for the memory system type definitions and validation.
 * These tests verify that our memory types are correctly structured
 * and can be validated before hitting Convex.
 */

import { describe, it, expect } from "vitest";
import { z } from "zod";

// ============================================================================
// Memory Type Schemas (to be implemented in src/lib/memory/types.ts)
// ============================================================================

// Episodic Memory Schema
const EpisodicMemorySchema = z.object({
  userId: z.string().min(1),
  projectId: z.string().optional(),
  content: z.string().min(1),
  embedding: z.array(z.number()).optional(),
  memoryType: z.enum([
    "interaction",
    "decision",
    "preference",
    "feedback",
    "milestone",
  ]),
  importance: z.number().min(0).max(1),
  timestamp: z.number(),
  metadata: z
    .object({
      toolsUsed: z.array(z.string()).optional(),
      outcome: z.string().optional(),
      relatedMemories: z.array(z.string()).optional(),
    })
    .optional(),
});

// Semantic Memory Schema
const SemanticMemorySchema = z.object({
  userId: z.string().min(1),
  category: z.enum(["preference", "skill", "pattern", "fact"]),
  key: z.string().min(1),
  value: z.string().min(1),
  confidence: z.number().min(0).max(1),
  source: z.string().min(1),
  accessCount: z.number().min(0),
  lastAccessed: z.number(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

// Working Memory Schema
const WorkingMemorySchema = z.object({
  sessionId: z.string().min(1),
  userId: z.string().min(1),
  relevantEpisodicIds: z.array(z.string()),
  relevantSemanticIds: z.array(z.string()),
  contextSummary: z.string(),
  currentTask: z.string().optional(),
  createdAt: z.number(),
  expiresAt: z.number(),
});

// ============================================================================
// EPISODIC MEMORY TESTS
// ============================================================================

describe("EpisodicMemory Schema", () => {
  describe("valid memories", () => {
    it("should validate a minimal episodic memory", () => {
      const memory = {
        userId: "user_123",
        content: "User decided to use TypeScript for the project",
        memoryType: "decision" as const,
        importance: 0.8,
        timestamp: Date.now(),
      };

      expect(() => EpisodicMemorySchema.parse(memory)).not.toThrow();
    });

    it("should validate a fully populated episodic memory", () => {
      const memory = {
        userId: "user_123",
        projectId: "project_456",
        content: "User gave positive feedback on dark mode implementation",
        embedding: [0.1, 0.2, 0.3, 0.4, 0.5],
        memoryType: "feedback" as const,
        importance: 0.7,
        timestamp: Date.now(),
        metadata: {
          toolsUsed: ["navigate_to", "render_ui"],
          outcome: "positive",
          relatedMemories: ["mem_001", "mem_002"],
        },
      };

      expect(() => EpisodicMemorySchema.parse(memory)).not.toThrow();
    });

    it("should validate all memory types", () => {
      const memoryTypes = [
        "interaction",
        "decision",
        "preference",
        "feedback",
        "milestone",
      ] as const;

      memoryTypes.forEach((memoryType) => {
        const memory = {
          userId: "user_123",
          content: `Test ${memoryType} memory`,
          memoryType,
          importance: 0.5,
          timestamp: Date.now(),
        };

        expect(() => EpisodicMemorySchema.parse(memory)).not.toThrow();
      });
    });

    it("should validate importance at boundaries (0 and 1)", () => {
      const memoryLow = {
        userId: "user_123",
        content: "Low importance memory",
        memoryType: "interaction" as const,
        importance: 0,
        timestamp: Date.now(),
      };

      const memoryHigh = {
        userId: "user_123",
        content: "High importance memory",
        memoryType: "milestone" as const,
        importance: 1,
        timestamp: Date.now(),
      };

      expect(() => EpisodicMemorySchema.parse(memoryLow)).not.toThrow();
      expect(() => EpisodicMemorySchema.parse(memoryHigh)).not.toThrow();
    });
  });

  describe("invalid memories", () => {
    it("should reject empty userId", () => {
      const memory = {
        userId: "",
        content: "Some content",
        memoryType: "decision" as const,
        importance: 0.5,
        timestamp: Date.now(),
      };

      expect(() => EpisodicMemorySchema.parse(memory)).toThrow();
    });

    it("should reject empty content", () => {
      const memory = {
        userId: "user_123",
        content: "",
        memoryType: "decision" as const,
        importance: 0.5,
        timestamp: Date.now(),
      };

      expect(() => EpisodicMemorySchema.parse(memory)).toThrow();
    });

    it("should reject invalid memory type", () => {
      const memory = {
        userId: "user_123",
        content: "Some content",
        memoryType: "invalid_type",
        importance: 0.5,
        timestamp: Date.now(),
      };

      expect(() => EpisodicMemorySchema.parse(memory)).toThrow();
    });

    it("should reject importance out of range", () => {
      const memoryNegative = {
        userId: "user_123",
        content: "Content",
        memoryType: "decision" as const,
        importance: -0.1,
        timestamp: Date.now(),
      };

      const memoryOverOne = {
        userId: "user_123",
        content: "Content",
        memoryType: "decision" as const,
        importance: 1.1,
        timestamp: Date.now(),
      };

      expect(() => EpisodicMemorySchema.parse(memoryNegative)).toThrow();
      expect(() => EpisodicMemorySchema.parse(memoryOverOne)).toThrow();
    });

    it("should reject missing required fields", () => {
      const incompleteMemory = {
        userId: "user_123",
        // Missing: content, memoryType, importance, timestamp
      };

      expect(() => EpisodicMemorySchema.parse(incompleteMemory)).toThrow();
    });
  });
});

// ============================================================================
// SEMANTIC MEMORY TESTS
// ============================================================================

describe("SemanticMemory Schema", () => {
  describe("valid memories", () => {
    it("should validate a complete semantic memory", () => {
      const memory = {
        userId: "user_123",
        category: "preference" as const,
        key: "code_style",
        value: "Prefers functional components over class components",
        confidence: 0.9,
        source: "multiple_interactions",
        accessCount: 5,
        lastAccessed: Date.now(),
        createdAt: Date.now() - 86400000,
        updatedAt: Date.now(),
      };

      expect(() => SemanticMemorySchema.parse(memory)).not.toThrow();
    });

    it("should validate all category types", () => {
      const categories = ["preference", "skill", "pattern", "fact"] as const;

      categories.forEach((category) => {
        const memory = {
          userId: "user_123",
          category,
          key: `test_${category}`,
          value: `Test value for ${category}`,
          confidence: 0.75,
          source: "test",
          accessCount: 0,
          lastAccessed: Date.now(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        expect(() => SemanticMemorySchema.parse(memory)).not.toThrow();
      });
    });

    it("should validate confidence at boundaries", () => {
      const baseMemory = {
        userId: "user_123",
        category: "skill" as const,
        key: "typescript",
        value: "Advanced TypeScript user",
        source: "code_analysis",
        accessCount: 10,
        lastAccessed: Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      expect(() =>
        SemanticMemorySchema.parse({ ...baseMemory, confidence: 0 })
      ).not.toThrow();
      expect(() =>
        SemanticMemorySchema.parse({ ...baseMemory, confidence: 1 })
      ).not.toThrow();
    });
  });

  describe("invalid memories", () => {
    it("should reject invalid category", () => {
      const memory = {
        userId: "user_123",
        category: "invalid_category",
        key: "test",
        value: "test value",
        confidence: 0.5,
        source: "test",
        accessCount: 0,
        lastAccessed: Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      expect(() => SemanticMemorySchema.parse(memory)).toThrow();
    });

    it("should reject empty key", () => {
      const memory = {
        userId: "user_123",
        category: "preference" as const,
        key: "",
        value: "test value",
        confidence: 0.5,
        source: "test",
        accessCount: 0,
        lastAccessed: Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      expect(() => SemanticMemorySchema.parse(memory)).toThrow();
    });

    it("should reject negative accessCount", () => {
      const memory = {
        userId: "user_123",
        category: "preference" as const,
        key: "test",
        value: "test value",
        confidence: 0.5,
        source: "test",
        accessCount: -1,
        lastAccessed: Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      expect(() => SemanticMemorySchema.parse(memory)).toThrow();
    });

    it("should reject confidence out of range", () => {
      const baseMemory = {
        userId: "user_123",
        category: "preference" as const,
        key: "test",
        value: "test value",
        source: "test",
        accessCount: 0,
        lastAccessed: Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      expect(() =>
        SemanticMemorySchema.parse({ ...baseMemory, confidence: -0.1 })
      ).toThrow();
      expect(() =>
        SemanticMemorySchema.parse({ ...baseMemory, confidence: 1.1 })
      ).toThrow();
    });
  });
});

// ============================================================================
// WORKING MEMORY TESTS
// ============================================================================

describe("WorkingMemory Schema", () => {
  describe("valid memories", () => {
    it("should validate a minimal working memory", () => {
      const memory = {
        sessionId: "session_abc123",
        userId: "user_123",
        relevantEpisodicIds: [],
        relevantSemanticIds: [],
        contextSummary: "",
        createdAt: Date.now(),
        expiresAt: Date.now() + 1800000, // 30 minutes
      };

      expect(() => WorkingMemorySchema.parse(memory)).not.toThrow();
    });

    it("should validate a fully populated working memory", () => {
      const memory = {
        sessionId: "session_abc123",
        userId: "user_123",
        relevantEpisodicIds: ["ep_001", "ep_002", "ep_003"],
        relevantSemanticIds: ["sem_001", "sem_002"],
        contextSummary:
          "User prefers TypeScript, working on dashboard project, previously discussed auth patterns",
        currentTask: "Implementing OAuth flow",
        createdAt: Date.now(),
        expiresAt: Date.now() + 1800000,
      };

      expect(() => WorkingMemorySchema.parse(memory)).not.toThrow();
    });
  });

  describe("invalid memories", () => {
    it("should reject empty sessionId", () => {
      const memory = {
        sessionId: "",
        userId: "user_123",
        relevantEpisodicIds: [],
        relevantSemanticIds: [],
        contextSummary: "",
        createdAt: Date.now(),
        expiresAt: Date.now() + 1800000,
      };

      expect(() => WorkingMemorySchema.parse(memory)).toThrow();
    });

    it("should reject empty userId", () => {
      const memory = {
        sessionId: "session_123",
        userId: "",
        relevantEpisodicIds: [],
        relevantSemanticIds: [],
        contextSummary: "",
        createdAt: Date.now(),
        expiresAt: Date.now() + 1800000,
      };

      expect(() => WorkingMemorySchema.parse(memory)).toThrow();
    });
  });
});

// ============================================================================
// IMPORTANCE CALCULATION TESTS
// ============================================================================

describe("Importance Calculation", () => {
  // Mock importance calculation function
  function calculateImportance(interaction: {
    userMessage: string;
    toolsUsed: string[];
    hasDecision: boolean;
    hasPositiveFeedback: boolean;
  }): number {
    let score = 0.3; // Base

    if (interaction.hasPositiveFeedback) score += 0.2;
    if (interaction.toolsUsed.length > 2) score += 0.15;
    if (interaction.hasDecision) score += 0.2;
    if (
      interaction.toolsUsed.some((t) => /create|update|delete/.test(t))
    )
      score += 0.15;

    return Math.min(score, 1);
  }

  it("should return base importance for simple interactions", () => {
    const importance = calculateImportance({
      userMessage: "Hello",
      toolsUsed: [],
      hasDecision: false,
      hasPositiveFeedback: false,
    });

    expect(importance).toBe(0.3);
  });

  it("should increase importance for positive feedback", () => {
    const importance = calculateImportance({
      userMessage: "Thanks, that's perfect!",
      toolsUsed: [],
      hasDecision: false,
      hasPositiveFeedback: true,
    });

    expect(importance).toBe(0.5);
  });

  it("should increase importance for decisions", () => {
    const importance = calculateImportance({
      userMessage: "Let's use Next.js for this",
      toolsUsed: [],
      hasDecision: true,
      hasPositiveFeedback: false,
    });

    expect(importance).toBe(0.5);
  });

  it("should increase importance for multiple tools used", () => {
    const importance = calculateImportance({
      userMessage: "Create the project",
      toolsUsed: ["search", "navigate", "render_ui"],
      hasDecision: false,
      hasPositiveFeedback: false,
    });

    expect(importance).toBeCloseTo(0.45, 5);
  });

  it("should increase importance for create/update/delete operations", () => {
    const importance = calculateImportance({
      userMessage: "Create a new project",
      toolsUsed: ["create_project"],
      hasDecision: false,
      hasPositiveFeedback: false,
    });

    expect(importance).toBeCloseTo(0.45, 5);
  });

  it("should cap importance at 1.0", () => {
    const importance = calculateImportance({
      userMessage: "Create a new project, thanks!",
      toolsUsed: ["create_project", "update_project", "navigate", "render_ui"],
      hasDecision: true,
      hasPositiveFeedback: true,
    });

    expect(importance).toBe(1);
  });
});

// ============================================================================
// MEMORY CLASSIFICATION TESTS
// ============================================================================

describe("Memory Classification", () => {
  // Mock classification function
  function classifyInteraction(interaction: {
    userMessage: string;
    toolsUsed: string[];
  }): "interaction" | "decision" | "preference" | "feedback" | "milestone" {
    const msg = interaction.userMessage.toLowerCase();

    if (/thanks|great|perfect|awesome|excellent/.test(msg)) return "feedback";
    if (/prefer|like|want|rather|always use/.test(msg)) return "preference";
    if (/decide|choose|let's go with|use this/.test(msg)) return "decision";
    if (
      interaction.toolsUsed.some((t) =>
        /create_project|create_prd|shard_prd/.test(t)
      )
    )
      return "milestone";

    return "interaction";
  }

  it("should classify positive feedback messages", () => {
    expect(
      classifyInteraction({
        userMessage: "Thanks, that looks great!",
        toolsUsed: [],
      })
    ).toBe("feedback");

    expect(
      classifyInteraction({
        userMessage: "Perfect, exactly what I wanted",
        toolsUsed: [],
      })
    ).toBe("feedback");
  });

  it("should classify preference expressions", () => {
    expect(
      classifyInteraction({
        userMessage: "I prefer dark mode",
        toolsUsed: [],
      })
    ).toBe("preference");

    expect(
      classifyInteraction({
        userMessage: "I always use TypeScript",
        toolsUsed: [],
      })
    ).toBe("preference");
  });

  it("should classify decision statements", () => {
    expect(
      classifyInteraction({
        userMessage: "Let's go with Next.js",
        toolsUsed: [],
      })
    ).toBe("decision");

    expect(
      classifyInteraction({
        userMessage: "I decide to use Convex",
        toolsUsed: [],
      })
    ).toBe("decision");
  });

  it("should classify milestone events based on tools", () => {
    expect(
      classifyInteraction({
        userMessage: "Create the PRD",
        toolsUsed: ["create_prd"],
      })
    ).toBe("milestone");

    expect(
      classifyInteraction({
        userMessage: "Start the project",
        toolsUsed: ["create_project"],
      })
    ).toBe("milestone");
  });

  it("should default to interaction for general messages", () => {
    expect(
      classifyInteraction({
        userMessage: "How does the auth system work?",
        toolsUsed: ["search_portfolio"],
      })
    ).toBe("interaction");
  });
});
