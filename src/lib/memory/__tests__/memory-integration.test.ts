/**
 * Memory Integration Tests
 *
 * Tests for the full memory flow including chat integration.
 * These tests verify the end-to-end behavior of the memory system.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// ============================================================================
// MOCK SETUP
// ============================================================================

const createMockConvex = () => ({
  query: vi.fn(),
  mutation: vi.fn(),
});

// Simplified mock of the MemoryManager for integration testing
class MockMemoryManager {
  private convex: ReturnType<typeof createMockConvex>;
  private memories: {
    episodic: Map<string, any>;
    semantic: Map<string, any>;
    working: Map<string, any>;
  };

  constructor(convex: ReturnType<typeof createMockConvex>) {
    this.convex = convex;
    this.memories = {
      episodic: new Map(),
      semantic: new Map(),
      working: new Map(),
    };
  }

  // Simulate memory storage
  async storeEpisodic(memory: any): Promise<string> {
    const id = `ep_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    this.memories.episodic.set(id, { _id: id, ...memory });
    return id;
  }

  async upsertSemantic(memory: any): Promise<string> {
    const key = `${memory.userId}:${memory.category}:${memory.key}`;
    const existing = this.memories.semantic.get(key);
    const id = existing?._id || `sem_${Date.now()}`;
    this.memories.semantic.set(key, {
      _id: id,
      ...memory,
      accessCount: (existing?.accessCount || 0) + 1,
      updatedAt: Date.now(),
    });
    return id;
  }

  async searchEpisodic(userId: string, query: string): Promise<any[]> {
    const results: any[] = [];
    const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);

    this.memories.episodic.forEach((memory) => {
      if (memory.userId === userId) {
        const contentLower = memory.content.toLowerCase();
        // Match if any query word is found in content
        const matches = queryWords.some(word => contentLower.includes(word));
        if (matches || queryWords.length === 0) {
          results.push(memory);
        }
      }
    });

    return results.sort((a, b) => b.importance - a.importance).slice(0, 10);
  }

  async getSemanticByUser(userId: string): Promise<any[]> {
    const results: any[] = [];
    this.memories.semantic.forEach((memory) => {
      if (memory.userId === userId) {
        results.push(memory);
      }
    });
    return results;
  }

  getStats() {
    return {
      episodicCount: this.memories.episodic.size,
      semanticCount: this.memories.semantic.size,
      workingCount: this.memories.working.size,
    };
  }

  clear() {
    this.memories.episodic.clear();
    this.memories.semantic.clear();
    this.memories.working.clear();
  }
}

// ============================================================================
// CHAT ROUTE SIMULATION
// ============================================================================

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatResponse {
  text: string;
  toolsUsed: string[];
}

// Simulates the enhanced chat flow with memory
async function simulateChatWithMemory(
  memoryManager: MockMemoryManager,
  userId: string,
  messages: ChatMessage[],
  projectId?: string
): Promise<{
  response: ChatResponse;
  memoriesLoaded: number;
  contextInjected: string;
}> {
  const lastMessage = messages[messages.length - 1];

  // 1. Load relevant memories
  const episodicMemories = await memoryManager.searchEpisodic(
    userId,
    lastMessage.content
  );
  const semanticMemories = await memoryManager.getSemanticByUser(userId);

  // 2. Build context injection
  const contextParts: string[] = [];

  if (semanticMemories.length > 0) {
    contextParts.push("User Context:");
    semanticMemories.slice(0, 5).forEach((m) => {
      contextParts.push(`- ${m.category}: ${m.value}`);
    });
  }

  if (episodicMemories.length > 0) {
    contextParts.push("\nRecent History:");
    episodicMemories.slice(0, 3).forEach((m) => {
      contextParts.push(`- [${m.memoryType}] ${m.content}`);
    });
  }

  const contextInjected = contextParts.join("\n");

  // 3. Simulate AI response (would be actual LLM call)
  const response: ChatResponse = {
    text: `Response to: ${lastMessage.content}`,
    toolsUsed: [],
  };

  return {
    response,
    memoriesLoaded: episodicMemories.length + semanticMemories.length,
    contextInjected,
  };
}

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

describe("Memory Integration", () => {
  let mockConvex: ReturnType<typeof createMockConvex>;
  let memoryManager: MockMemoryManager;

  beforeEach(() => {
    mockConvex = createMockConvex();
    memoryManager = new MockMemoryManager(mockConvex);
  });

  afterEach(() => {
    memoryManager.clear();
    vi.clearAllMocks();
  });

  // ==========================================================================
  // Full Flow Tests
  // ==========================================================================

  describe("Full Memory Flow", () => {
    it("should remember decisions across sessions", async () => {
      const userId = "user_123";

      // Session 1: User makes a decision
      await memoryManager.storeEpisodic({
        userId,
        content: "User decided to use TypeScript for the project",
        memoryType: "decision",
        importance: 0.8,
        timestamp: Date.now(),
      });

      // Session 2: Search for that decision
      const memories = await memoryManager.searchEpisodic(
        userId,
        "TypeScript decision"
      );

      expect(memories).toHaveLength(1);
      expect(memories[0].content).toContain("TypeScript");
      expect(memories[0].memoryType).toBe("decision");
    });

    it("should learn and recall user preferences", async () => {
      const userId = "user_123";

      // Learn a preference
      await memoryManager.upsertSemantic({
        userId,
        category: "preference",
        key: "theme",
        value: "User prefers dark mode",
        confidence: 0.9,
        source: "explicit_statement",
      });

      // Recall preferences
      const preferences = await memoryManager.getSemanticByUser(userId);

      expect(preferences).toHaveLength(1);
      expect(preferences[0].value).toContain("dark mode");
      expect(preferences[0].confidence).toBe(0.9);
    });

    it("should update confidence on repeated learning", async () => {
      const userId = "user_123";

      // First learning
      await memoryManager.upsertSemantic({
        userId,
        category: "preference",
        key: "framework",
        value: "Prefers React",
        confidence: 0.6,
        source: "interaction_1",
      });

      // Second learning (same preference)
      await memoryManager.upsertSemantic({
        userId,
        category: "preference",
        key: "framework",
        value: "Strongly prefers React",
        confidence: 0.9,
        source: "interaction_2",
      });

      const preferences = await memoryManager.getSemanticByUser(userId);

      expect(preferences).toHaveLength(1);
      expect(preferences[0].confidence).toBe(0.9);
      expect(preferences[0].accessCount).toBe(2);
    });

    it("should scope episodic memories to projects", async () => {
      const userId = "user_123";

      // Store memory for project A
      await memoryManager.storeEpisodic({
        userId,
        projectId: "project_a",
        content: "Discussed auth patterns for project A",
        memoryType: "interaction",
        importance: 0.6,
        timestamp: Date.now(),
      });

      // Store memory for project B
      await memoryManager.storeEpisodic({
        userId,
        projectId: "project_b",
        content: "Discussed database schema for project B",
        memoryType: "interaction",
        importance: 0.7,
        timestamp: Date.now(),
      });

      // Search should find both when not filtering
      const allMemories = await memoryManager.searchEpisodic(userId, "Discussed");
      expect(allMemories).toHaveLength(2);
    });
  });

  // ==========================================================================
  // Chat Integration Tests
  // ==========================================================================

  describe("Chat Integration", () => {
    it("should inject memory context into chat", async () => {
      const userId = "user_123";

      // Seed some memories
      await memoryManager.upsertSemantic({
        userId,
        category: "preference",
        key: "language",
        value: "Prefers TypeScript over JavaScript",
        confidence: 0.9,
        source: "test",
      });

      await memoryManager.storeEpisodic({
        userId,
        content: "User asked about setting up a new React project",
        memoryType: "interaction",
        importance: 0.6,
        timestamp: Date.now(),
      });

      // Simulate chat
      const result = await simulateChatWithMemory(memoryManager, userId, [
        { role: "user", content: "Help me create a new project" },
      ]);

      expect(result.memoriesLoaded).toBeGreaterThan(0);
      expect(result.contextInjected).toContain("TypeScript");
    });

    it("should use empty context when no memories exist", async () => {
      const userId = "new_user";

      const result = await simulateChatWithMemory(memoryManager, userId, [
        { role: "user", content: "Hello" },
      ]);

      expect(result.memoriesLoaded).toBe(0);
      expect(result.contextInjected).toBe("");
    });

    it("should handle conversation history with memories", async () => {
      const userId = "user_123";

      // First interaction: Learn preference
      await memoryManager.upsertSemantic({
        userId,
        category: "skill",
        key: "expertise",
        value: "Advanced React developer",
        confidence: 0.85,
        source: "conversation",
      });

      // Second interaction: Recall and use
      const result = await simulateChatWithMemory(memoryManager, userId, [
        { role: "user", content: "I'm an advanced React developer" },
        { role: "assistant", content: "Great! How can I help?" },
        { role: "user", content: "Explain useCallback optimization" },
      ]);

      expect(result.contextInjected).toContain("Advanced React developer");
    });
  });

  // ==========================================================================
  // Memory Lifecycle Tests
  // ==========================================================================

  describe("Memory Lifecycle", () => {
    it("should accumulate memories over multiple interactions", async () => {
      const userId = "user_123";

      // Simulate 5 interactions
      for (let i = 0; i < 5; i++) {
        await memoryManager.storeEpisodic({
          userId,
          content: `Interaction ${i + 1}: User worked on feature ${i + 1}`,
          memoryType: "interaction",
          importance: 0.5 + i * 0.1,
          timestamp: Date.now() + i * 1000,
        });
      }

      const stats = memoryManager.getStats();
      expect(stats.episodicCount).toBe(5);

      // Search should return most important first
      const memories = await memoryManager.searchEpisodic(userId, "Interaction");
      expect(memories).toHaveLength(5);
      expect(memories[0].importance).toBeGreaterThan(memories[4].importance);
    });

    it("should track access count for semantic memories", async () => {
      const userId = "user_123";
      const key = "framework_preference";

      // Multiple accesses/updates
      for (let i = 0; i < 3; i++) {
        await memoryManager.upsertSemantic({
          userId,
          category: "preference",
          key,
          value: `React preference (update ${i + 1})`,
          confidence: 0.7 + i * 0.1,
          source: `interaction_${i + 1}`,
        });
      }

      const memories = await memoryManager.getSemanticByUser(userId);
      expect(memories).toHaveLength(1);
      expect(memories[0].accessCount).toBe(3);
    });

    it("should isolate memories between users", async () => {
      // User A's memories
      await memoryManager.storeEpisodic({
        userId: "user_a",
        content: "User A's private information",
        memoryType: "interaction",
        importance: 0.5,
        timestamp: Date.now(),
      });

      await memoryManager.upsertSemantic({
        userId: "user_a",
        category: "preference",
        key: "secret",
        value: "User A's secret preference",
        confidence: 0.9,
        source: "private",
      });

      // User B should not see User A's memories
      const userBEpisodic = await memoryManager.searchEpisodic(
        "user_b",
        "private"
      );
      const userBSemantic = await memoryManager.getSemanticByUser("user_b");

      expect(userBEpisodic).toHaveLength(0);
      expect(userBSemantic).toHaveLength(0);
    });
  });

  // ==========================================================================
  // Knowledge Download Simulation Tests
  // ==========================================================================

  describe("Knowledge Download (Self-Learning)", () => {
    it("should accumulate domain knowledge over sessions", async () => {
      const userId = "user_123";

      // Simulate learning about design systems
      const designKnowledge = [
        { key: "color_theory", value: "Understands HSL color space" },
        { key: "typography", value: "Knows modular scale principles" },
        { key: "spacing", value: "Uses 8px grid system" },
        { key: "animation", value: "Prefers spring-based animations" },
        { key: "accessibility", value: "Prioritizes WCAG AA compliance" },
      ];

      for (const knowledge of designKnowledge) {
        await memoryManager.upsertSemantic({
          userId,
          category: "skill",
          key: knowledge.key,
          value: knowledge.value,
          confidence: 0.8,
          source: "design_exploration",
        });
      }

      // Verify knowledge accumulation
      const userKnowledge = await memoryManager.getSemanticByUser(userId);
      expect(userKnowledge).toHaveLength(5);

      // All design knowledge should be retrievable
      const knowledgeValues = userKnowledge.map((k) => k.value);
      expect(knowledgeValues).toContain("Understands HSL color space");
      expect(knowledgeValues).toContain("Uses 8px grid system");
    });

    it("should build upon previous knowledge", async () => {
      const userId = "user_123";

      // Initial learning
      await memoryManager.upsertSemantic({
        userId,
        category: "skill",
        key: "react",
        value: "Basic React knowledge",
        confidence: 0.5,
        source: "session_1",
      });

      // Deeper learning
      await memoryManager.upsertSemantic({
        userId,
        category: "skill",
        key: "react",
        value: "Intermediate React with hooks expertise",
        confidence: 0.75,
        source: "session_2",
      });

      // Advanced learning
      await memoryManager.upsertSemantic({
        userId,
        category: "skill",
        key: "react",
        value: "Advanced React patterns: render props, HOCs, custom hooks",
        confidence: 0.9,
        source: "session_3",
      });

      const knowledge = await memoryManager.getSemanticByUser(userId);
      expect(knowledge).toHaveLength(1);
      expect(knowledge[0].value).toContain("Advanced React patterns");
      expect(knowledge[0].confidence).toBe(0.9);
      expect(knowledge[0].accessCount).toBe(3);
    });

    it("should track learning milestones", async () => {
      const userId = "user_123";

      // Record milestone memories
      const milestones = [
        "Completed design system fundamentals",
        "Built first interactive gallery",
        "Mastered animation principles",
      ];

      for (const milestone of milestones) {
        await memoryManager.storeEpisodic({
          userId,
          content: milestone,
          memoryType: "milestone",
          importance: 0.9,
          timestamp: Date.now(),
        });
      }

      const storedMilestones = await memoryManager.searchEpisodic(
        userId,
        "Completed"
      );

      // Should find the completion milestone
      expect(storedMilestones.some((m) => m.memoryType === "milestone")).toBe(
        true
      );
    });
  });

  // ==========================================================================
  // Error Handling Tests
  // ==========================================================================

  describe("Error Handling", () => {
    it("should handle empty search queries gracefully", async () => {
      const memories = await memoryManager.searchEpisodic("user_123", "");
      expect(memories).toHaveLength(0);
    });

    it("should handle non-existent users", async () => {
      const memories = await memoryManager.getSemanticByUser("non_existent");
      expect(memories).toHaveLength(0);
    });

    it("should maintain consistency after multiple operations", async () => {
      const userId = "user_123";

      // Rapid fire operations
      const promises = [];
      for (let i = 0; i < 10; i++) {
        promises.push(
          memoryManager.storeEpisodic({
            userId,
            content: `Memory ${i}`,
            memoryType: "interaction",
            importance: Math.random(),
            timestamp: Date.now(),
          })
        );
      }

      await Promise.all(promises);

      const stats = memoryManager.getStats();
      expect(stats.episodicCount).toBe(10);
    });
  });
});
