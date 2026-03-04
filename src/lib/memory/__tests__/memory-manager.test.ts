/**
 * MemoryManager Unit Tests
 *
 * Tests for the MemoryManager class that handles memory operations.
 * Uses mocked Convex client to test logic independently.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// ============================================================================
// MOCK TYPES (to be implemented)
// ============================================================================

interface EpisodicMemory {
  _id: string;
  userId: string;
  projectId?: string;
  content: string;
  memoryType: "interaction" | "decision" | "preference" | "feedback" | "milestone";
  importance: number;
  timestamp: number;
  metadata?: {
    toolsUsed?: string[];
    outcome?: string;
  };
}

interface SemanticMemory {
  _id: string;
  userId: string;
  category: "preference" | "skill" | "pattern" | "fact";
  key: string;
  value: string;
  confidence: number;
  source: string;
  accessCount: number;
  lastAccessed: number;
}

interface MemorySearchResult {
  episodic: EpisodicMemory[];
  semantic: SemanticMemory[];
  contextSummary: string;
}

// ============================================================================
// MOCK CONVEX CLIENT
// ============================================================================

const createMockConvex = () => ({
  query: vi.fn(),
  mutation: vi.fn(),
});

// ============================================================================
// MEMORY MANAGER CLASS (to be implemented)
// ============================================================================

class MemoryManager {
  constructor(private convex: ReturnType<typeof createMockConvex>) {}

  async loadRelevantMemories(
    userId: string,
    query: string,
    options: {
      projectId?: string;
      limit?: number;
      includeEpisodic?: boolean;
      includeSemantic?: boolean;
    } = {}
  ): Promise<MemorySearchResult> {
    const { limit = 10, includeEpisodic = true, includeSemantic = true } = options;

    const [episodic, semantic] = await Promise.all([
      includeEpisodic
        ? this.searchEpisodicMemories(userId, query, options.projectId, limit)
        : [],
      includeSemantic
        ? this.loadSemanticMemories(userId, this.extractCategories(query))
        : [],
    ]);

    const contextSummary = this.buildContextSummary(episodic, semantic);

    return { episodic, semantic, contextSummary };
  }

  async searchEpisodicMemories(
    userId: string,
    query: string,
    projectId?: string,
    limit: number = 10
  ): Promise<EpisodicMemory[]> {
    const results = await this.convex.query("memories:searchEpisodic", {
      userId,
      query,
      projectId,
      limit,
    });
    return results || [];
  }

  async loadSemanticMemories(
    userId: string,
    categories: string[]
  ): Promise<SemanticMemory[]> {
    const results = await this.convex.query("memories:getSemanticByCategories", {
      userId,
      categories,
    });
    return results || [];
  }

  extractCategories(query: string): string[] {
    const categories: string[] = [];
    const lowerQuery = query.toLowerCase();

    if (/prefer|like|style|theme|mode/.test(lowerQuery)) {
      categories.push("preference");
    }
    if (/skill|know|experience|proficient|expert/.test(lowerQuery)) {
      categories.push("skill");
    }
    if (/pattern|usually|always|tend to/.test(lowerQuery)) {
      categories.push("pattern");
    }
    if (/fact|is|are|does|what/.test(lowerQuery)) {
      categories.push("fact");
    }

    return categories.length > 0 ? categories : ["preference", "skill", "pattern"];
  }

  buildContextSummary(
    episodic: EpisodicMemory[],
    semantic: SemanticMemory[]
  ): string {
    const parts: string[] = [];

    // Add semantic memories (facts/preferences)
    if (semantic.length > 0) {
      const semanticSummary = semantic
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 5)
        .map((m) => `- ${m.category}: ${m.value}`)
        .join("\n");
      parts.push(`User Context:\n${semanticSummary}`);
    }

    // Add recent relevant episodic memories
    if (episodic.length > 0) {
      const episodicSummary = episodic
        .sort((a, b) => b.importance - a.importance)
        .slice(0, 3)
        .map((m) => `- [${m.memoryType}] ${m.content}`)
        .join("\n");
      parts.push(`Recent History:\n${episodicSummary}`);
    }

    return parts.join("\n\n");
  }

  calculateImportance(interaction: {
    userMessage: string;
    aiResponse: string;
    toolsUsed: string[];
  }): number {
    let score = 0.3;

    // Positive feedback signals
    if (/thanks|perfect|great|exactly|awesome/i.test(interaction.userMessage)) {
      score += 0.2;
    }

    // Multiple tools indicate complex interaction
    if (interaction.toolsUsed.length > 2) {
      score += 0.15;
    }

    // Decision-making language
    if (/decide|choose|prefer|want|let's/i.test(interaction.userMessage)) {
      score += 0.2;
    }

    // Creation operations are important
    if (interaction.toolsUsed.some((t) => /create|update|delete/.test(t))) {
      score += 0.15;
    }

    return Math.min(score, 1);
  }

  classifyInteraction(interaction: {
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

  async storeEpisodicMemory(
    userId: string,
    content: string,
    memoryType: EpisodicMemory["memoryType"],
    importance: number,
    projectId?: string,
    metadata?: EpisodicMemory["metadata"]
  ): Promise<string> {
    const result = await this.convex.mutation("memories:storeEpisodic", {
      userId,
      projectId,
      content,
      memoryType,
      importance,
      timestamp: Date.now(),
      metadata,
    });
    return result;
  }

  async upsertSemanticMemory(
    userId: string,
    category: SemanticMemory["category"],
    key: string,
    value: string,
    confidence: number,
    source: string
  ): Promise<string> {
    const result = await this.convex.mutation("memories:upsertSemantic", {
      userId,
      category,
      key,
      value,
      confidence,
      source,
    });
    return result;
  }

  async processInteraction(
    userId: string,
    interaction: {
      userMessage: string;
      aiResponse: string;
      toolsUsed: string[];
    },
    projectId?: string
  ): Promise<void> {
    const importance = this.calculateImportance(interaction);

    // Only store significant interactions (importance > 0.3)
    if (importance > 0.3) {
      const memoryType = this.classifyInteraction(interaction);
      const content = this.summarizeInteraction(interaction);

      await this.storeEpisodicMemory(
        userId,
        content,
        memoryType,
        importance,
        projectId,
        { toolsUsed: interaction.toolsUsed }
      );
    }

    // Extract and store patterns
    const patterns = this.extractPatterns(interaction);
    for (const pattern of patterns) {
      await this.upsertSemanticMemory(
        userId,
        pattern.category,
        pattern.key,
        pattern.value,
        pattern.confidence,
        "interaction_learning"
      );
    }
  }

  summarizeInteraction(interaction: {
    userMessage: string;
    aiResponse: string;
    toolsUsed: string[];
  }): string {
    // Truncate and summarize
    const userPart =
      interaction.userMessage.length > 100
        ? interaction.userMessage.slice(0, 100) + "..."
        : interaction.userMessage;

    if (interaction.toolsUsed.length > 0) {
      return `User: "${userPart}" → Tools: ${interaction.toolsUsed.join(", ")}`;
    }
    return `User: "${userPart}"`;
  }

  extractPatterns(interaction: {
    userMessage: string;
    aiResponse: string;
    toolsUsed: string[];
  }): Array<{
    category: SemanticMemory["category"];
    key: string;
    value: string;
    confidence: number;
  }> {
    const patterns: Array<{
      category: SemanticMemory["category"];
      key: string;
      value: string;
      confidence: number;
    }> = [];

    const msg = interaction.userMessage.toLowerCase();

    // Detect preference patterns
    if (/prefer|like|rather|always use|my favorite/.test(msg)) {
      patterns.push({
        category: "preference",
        key: "detected_preference",
        value: interaction.userMessage.slice(0, 200),
        confidence: 0.6,
      });
    }

    // Detect skill mentions
    if (/i know|i can|experience with|proficient in/.test(msg)) {
      patterns.push({
        category: "skill",
        key: "detected_skill",
        value: interaction.userMessage.slice(0, 200),
        confidence: 0.5,
      });
    }

    return patterns;
  }
}

// ============================================================================
// TESTS
// ============================================================================

describe("MemoryManager", () => {
  let mockConvex: ReturnType<typeof createMockConvex>;
  let manager: MemoryManager;

  beforeEach(() => {
    mockConvex = createMockConvex();
    manager = new MemoryManager(mockConvex);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // ==========================================================================
  // loadRelevantMemories Tests
  // ==========================================================================

  describe("loadRelevantMemories", () => {
    it("should load both episodic and semantic memories by default", async () => {
      mockConvex.query
        .mockResolvedValueOnce([
          {
            _id: "ep_1",
            userId: "user_123",
            content: "User discussed auth patterns",
            memoryType: "interaction",
            importance: 0.7,
            timestamp: Date.now(),
          },
        ])
        .mockResolvedValueOnce([
          {
            _id: "sem_1",
            userId: "user_123",
            category: "preference",
            key: "framework",
            value: "Prefers React",
            confidence: 0.9,
            accessCount: 5,
            lastAccessed: Date.now(),
          },
        ]);

      const result = await manager.loadRelevantMemories(
        "user_123",
        "How do I implement auth?"
      );

      expect(result.episodic).toHaveLength(1);
      expect(result.semantic).toHaveLength(1);
      expect(result.contextSummary).toContain("User Context");
      expect(mockConvex.query).toHaveBeenCalledTimes(2);
    });

    it("should skip episodic memories when includeEpisodic is false", async () => {
      mockConvex.query.mockResolvedValueOnce([]);

      const result = await manager.loadRelevantMemories(
        "user_123",
        "What are my preferences?",
        { includeEpisodic: false }
      );

      expect(result.episodic).toHaveLength(0);
      expect(mockConvex.query).toHaveBeenCalledTimes(1);
    });

    it("should skip semantic memories when includeSemantic is false", async () => {
      mockConvex.query.mockResolvedValueOnce([]);

      const result = await manager.loadRelevantMemories(
        "user_123",
        "What happened yesterday?",
        { includeSemantic: false }
      );

      expect(result.semantic).toHaveLength(0);
      expect(mockConvex.query).toHaveBeenCalledTimes(1);
    });

    it("should pass projectId when provided", async () => {
      mockConvex.query.mockResolvedValue([]);

      await manager.loadRelevantMemories("user_123", "Show project history", {
        projectId: "project_456",
      });

      expect(mockConvex.query).toHaveBeenCalledWith(
        "memories:searchEpisodic",
        expect.objectContaining({ projectId: "project_456" })
      );
    });

    it("should respect limit parameter", async () => {
      mockConvex.query.mockResolvedValue([]);

      await manager.loadRelevantMemories("user_123", "Search memories", {
        limit: 5,
      });

      expect(mockConvex.query).toHaveBeenCalledWith(
        "memories:searchEpisodic",
        expect.objectContaining({ limit: 5 })
      );
    });
  });

  // ==========================================================================
  // extractCategories Tests
  // ==========================================================================

  describe("extractCategories", () => {
    it("should extract preference category for preference-related queries", () => {
      const categories = manager.extractCategories("What theme do I prefer?");
      expect(categories).toContain("preference");
    });

    it("should extract skill category for skill-related queries", () => {
      const categories = manager.extractCategories(
        "What skills do I have experience with?"
      );
      expect(categories).toContain("skill");
    });

    it("should extract pattern category for pattern-related queries", () => {
      const categories = manager.extractCategories("What do I usually do?");
      expect(categories).toContain("pattern");
    });

    it("should extract multiple categories when query matches multiple", () => {
      const categories = manager.extractCategories(
        "What is my preferred coding style that I usually use?"
      );
      expect(categories).toContain("preference");
      expect(categories).toContain("pattern");
    });

    it("should return defaults when no specific category detected", () => {
      const categories = manager.extractCategories("Random question");
      expect(categories).toEqual(["preference", "skill", "pattern"]);
    });
  });

  // ==========================================================================
  // buildContextSummary Tests
  // ==========================================================================

  describe("buildContextSummary", () => {
    it("should build summary with semantic memories", () => {
      const semantic: SemanticMemory[] = [
        {
          _id: "1",
          userId: "user_123",
          category: "preference",
          key: "framework",
          value: "Prefers React over Vue",
          confidence: 0.9,
          source: "interaction",
          accessCount: 10,
          lastAccessed: Date.now(),
        },
      ];

      const summary = manager.buildContextSummary([], semantic);
      expect(summary).toContain("User Context");
      expect(summary).toContain("Prefers React over Vue");
    });

    it("should build summary with episodic memories", () => {
      const episodic: EpisodicMemory[] = [
        {
          _id: "1",
          userId: "user_123",
          content: "Decided to use TypeScript",
          memoryType: "decision",
          importance: 0.8,
          timestamp: Date.now(),
        },
      ];

      const summary = manager.buildContextSummary(episodic, []);
      expect(summary).toContain("Recent History");
      expect(summary).toContain("Decided to use TypeScript");
      expect(summary).toContain("[decision]");
    });

    it("should sort memories by importance/confidence", () => {
      const semantic: SemanticMemory[] = [
        {
          _id: "1",
          userId: "user_123",
          category: "skill",
          key: "lang",
          value: "Low confidence skill",
          confidence: 0.3,
          source: "test",
          accessCount: 1,
          lastAccessed: Date.now(),
        },
        {
          _id: "2",
          userId: "user_123",
          category: "skill",
          key: "lang2",
          value: "High confidence skill",
          confidence: 0.9,
          source: "test",
          accessCount: 10,
          lastAccessed: Date.now(),
        },
      ];

      const summary = manager.buildContextSummary([], semantic);
      const highIndex = summary.indexOf("High confidence");
      const lowIndex = summary.indexOf("Low confidence");
      expect(highIndex).toBeLessThan(lowIndex);
    });

    it("should return empty string when no memories", () => {
      const summary = manager.buildContextSummary([], []);
      expect(summary).toBe("");
    });
  });

  // ==========================================================================
  // calculateImportance Tests
  // ==========================================================================

  describe("calculateImportance", () => {
    it("should return base importance for simple interactions", () => {
      const importance = manager.calculateImportance({
        userMessage: "Hello",
        aiResponse: "Hi there!",
        toolsUsed: [],
      });
      expect(importance).toBe(0.3);
    });

    it("should increase importance for positive feedback", () => {
      const importance = manager.calculateImportance({
        userMessage: "Thanks, that's perfect!",
        aiResponse: "You're welcome!",
        toolsUsed: [],
      });
      expect(importance).toBe(0.5);
    });

    it("should increase importance for decisions", () => {
      const importance = manager.calculateImportance({
        userMessage: "Let's go with TypeScript",
        aiResponse: "Great choice!",
        toolsUsed: [],
      });
      expect(importance).toBe(0.5);
    });

    it("should increase importance for multiple tools", () => {
      const importance = manager.calculateImportance({
        userMessage: "Search and navigate",
        aiResponse: "Done",
        toolsUsed: ["search", "navigate", "render"],
      });
      expect(importance).toBeCloseTo(0.45, 5);
    });

    it("should cap at 1.0 maximum", () => {
      const importance = manager.calculateImportance({
        userMessage: "Thanks! Let's decide to create this project!",
        aiResponse: "Creating project...",
        toolsUsed: ["create_project", "update", "delete", "extra"],
      });
      expect(importance).toBe(1);
    });
  });

  // ==========================================================================
  // processInteraction Tests
  // ==========================================================================

  describe("processInteraction", () => {
    it("should store episodic memory for important interactions", async () => {
      mockConvex.mutation.mockResolvedValue("mem_123");

      await manager.processInteraction("user_123", {
        userMessage: "Thanks, let's go with React!",
        aiResponse: "Great choice!",
        toolsUsed: ["navigate_to"],
      });

      expect(mockConvex.mutation).toHaveBeenCalledWith(
        "memories:storeEpisodic",
        expect.objectContaining({
          userId: "user_123",
          memoryType: "feedback",
        })
      );
    });

    it("should not store episodic memory for low importance interactions", async () => {
      // Simple interaction with no special signals
      await manager.processInteraction("user_123", {
        userMessage: "Hi",
        aiResponse: "Hello!",
        toolsUsed: [],
      });

      // Should not call storeEpisodic since importance is base 0.3 and threshold is > 0.3
      const episodicCalls = mockConvex.mutation.mock.calls.filter(
        (call) => call[0] === "memories:storeEpisodic"
      );
      expect(episodicCalls).toHaveLength(0);
    });

    it("should extract and store semantic patterns", async () => {
      mockConvex.mutation.mockResolvedValue("mem_123");

      await manager.processInteraction("user_123", {
        userMessage: "I prefer dark mode for all my apps",
        aiResponse: "Noted!",
        toolsUsed: [],
      });

      expect(mockConvex.mutation).toHaveBeenCalledWith(
        "memories:upsertSemantic",
        expect.objectContaining({
          userId: "user_123",
          category: "preference",
        })
      );
    });

    it("should include projectId when provided", async () => {
      mockConvex.mutation.mockResolvedValue("mem_123");

      await manager.processInteraction(
        "user_123",
        {
          userMessage: "Thanks for the help!",
          aiResponse: "You're welcome!",
          toolsUsed: [],
        },
        "project_456"
      );

      expect(mockConvex.mutation).toHaveBeenCalledWith(
        "memories:storeEpisodic",
        expect.objectContaining({
          projectId: "project_456",
        })
      );
    });
  });

  // ==========================================================================
  // summarizeInteraction Tests
  // ==========================================================================

  describe("summarizeInteraction", () => {
    it("should create summary with user message", () => {
      const summary = manager.summarizeInteraction({
        userMessage: "Help me with React",
        aiResponse: "Sure!",
        toolsUsed: [],
      });

      expect(summary).toContain("Help me with React");
    });

    it("should include tools when used", () => {
      const summary = manager.summarizeInteraction({
        userMessage: "Navigate to projects",
        aiResponse: "Navigating...",
        toolsUsed: ["navigate_to", "render_ui"],
      });

      expect(summary).toContain("navigate_to");
      expect(summary).toContain("render_ui");
    });

    it("should truncate long messages", () => {
      const longMessage = "A".repeat(200);
      const summary = manager.summarizeInteraction({
        userMessage: longMessage,
        aiResponse: "Response",
        toolsUsed: [],
      });

      expect(summary.length).toBeLessThan(200);
      expect(summary).toContain("...");
    });
  });

  // ==========================================================================
  // extractPatterns Tests
  // ==========================================================================

  describe("extractPatterns", () => {
    it("should extract preference patterns", () => {
      const patterns = manager.extractPatterns({
        userMessage: "I prefer using functional components",
        aiResponse: "Good choice!",
        toolsUsed: [],
      });

      expect(patterns).toHaveLength(1);
      expect(patterns[0].category).toBe("preference");
    });

    it("should extract skill patterns", () => {
      const patterns = manager.extractPatterns({
        userMessage: "I have experience with TypeScript",
        aiResponse: "Great!",
        toolsUsed: [],
      });

      expect(patterns).toHaveLength(1);
      expect(patterns[0].category).toBe("skill");
    });

    it("should extract multiple patterns", () => {
      const patterns = manager.extractPatterns({
        userMessage: "I prefer TypeScript and I know React well",
        aiResponse: "Perfect combination!",
        toolsUsed: [],
      });

      expect(patterns).toHaveLength(2);
      const categories = patterns.map((p) => p.category);
      expect(categories).toContain("preference");
      expect(categories).toContain("skill");
    });

    it("should return empty array for no patterns", () => {
      const patterns = manager.extractPatterns({
        userMessage: "Hello",
        aiResponse: "Hi!",
        toolsUsed: [],
      });

      expect(patterns).toHaveLength(0);
    });
  });
});
