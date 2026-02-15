/**
 * MemoryManager
 *
 * Handles memory operations for the RLM (Recursive Memory Layer) system.
 * Provides methods to store, retrieve, and manage episodic, semantic,
 * and working memory for Claw AI interactions.
 *
 * @see docs/philosophy/README.md#self-learning-systems
 * @see docs/planning/recursive-memory-layer-scope.md
 */

import { ConvexHttpClient, api, Id } from '../convex-shim';
import {
  EpisodicMemory,
  EpisodicMemoryType,
  ExtractedPattern,
  Interaction,
  MemorySearchOptions,
  MemorySearchResult,
  SemanticCategory,
  SemanticMemory,
} from "./types";

// Dynamic import to handle cases where api types aren't generated yet
// let api: any;
// try {
//   api = require('@/lib/convex-shim').api;
// } catch {
//   // API not generated yet - will use string paths
//   api = null;
// }

export class MemoryManager {
  private convex: ConvexHttpClient | null = null;

  constructor(convexUrl?: string) {
    const url = convexUrl || process.env.NEXT_PUBLIC_CONVEX_URL;
    if (url) {
      this.convex = new ConvexHttpClient(url);
    }
  }

  private getClient(): ConvexHttpClient {
    if (!this.convex) {
      const url = process.env.NEXT_PUBLIC_CONVEX_URL;
      if (!url) {
        throw new Error('NEXT_PUBLIC_CONVEX_URL not configured');
      }
      this.convex = new ConvexHttpClient(url);
    }
    return this.convex;
  }

  /**
   * Get the API reference
   */
  private getApiRef(path: string) {
    // If api is available (from shim or require), try to use it
    if (api) {
      const parts = path.split(".");
      let ref: any = api;
      for (const part of parts) {
        if (ref) {
          ref = ref[part];
        }
      }
      if (ref) return ref;
    }
    // Fallback: return the path string
    return path;
  }

  // ==========================================================================
  // MEMORY LOADING
  // ==========================================================================

  /**
   * Load relevant memories for a user query.
   * Combines episodic (events) and semantic (facts) memories.
   */
  async loadRelevantMemories(
    userId: string,
    query: string,
    options: MemorySearchOptions = {}
  ): Promise<MemorySearchResult> {
    const {
      limit = 10,
      includeEpisodic = true,
      includeSemantic = true,
      projectId,
    } = options;

    // Parallel fetch of episodic and semantic memories
    const [episodic, semantic] = await Promise.all([
      includeEpisodic
        ? this.searchEpisodicMemories(userId, query, projectId, limit)
        : [],
      includeSemantic
        ? this.loadSemanticMemories(userId, this.extractCategories(query))
        : [],
    ]);

    // Build context summary for prompt injection
    const contextSummary = this.buildContextSummary(episodic, semantic);

    return { episodic, semantic, contextSummary };
  }

  /**
   * Search episodic memories using text matching.
   */
  async searchEpisodicMemories(
    userId: string,
    query: string,
    projectId?: Id<"productProjects">,
    limit: number = 10
  ): Promise<EpisodicMemory[]> {
    const results = await this.getClient().query(
      this.getApiRef("memories.searchEpisodic"),
      { userId, query, projectId, limit }
    );
    return results as EpisodicMemory[];
  }

  /**
   * Load semantic memories by categories.
   */
  async loadSemanticMemories(
    userId: string,
    categories: SemanticCategory[]
  ): Promise<SemanticMemory[]> {
    const results = await this.getClient().query(
      this.getApiRef("memories.getSemanticByCategories"),
      { userId, categories }
    );
    return results as SemanticMemory[];
  }

  /**
   * Get all semantic memories for a user.
   */
  async getAllSemanticMemories(userId: string): Promise<SemanticMemory[]> {
    const results = await this.getClient().query(
      this.getApiRef("memories.getAllSemantic"),
      { userId }
    );
    return results as SemanticMemory[];
  }

  /**
   * Get recent episodic memories.
   */
  async getRecentMemories(
    userId: string,
    projectId?: Id<"productProjects">,
    limit: number = 10
  ): Promise<EpisodicMemory[]> {
    const results = await this.getClient().query(
      this.getApiRef("memories.getRecentEpisodic"),
      { userId, projectId, limit }
    );
    return results as EpisodicMemory[];
  }

  // ==========================================================================
  // MEMORY STORAGE
  // ==========================================================================

  /**
   * Store an episodic memory.
   */
  async storeEpisodicMemory(
    userId: string,
    content: string,
    memoryType: EpisodicMemoryType,
    importance: number,
    projectId?: Id<"productProjects">,
    metadata?: {
      toolsUsed?: string[];
      outcome?: string;
      compactionId?: string;
      messageCount?: number;
      topics?: string[];
      [key: string]: unknown;
    }
  ): Promise<Id<"episodicMemories">> {
    return await this.getClient().mutation(
      this.getApiRef("memories.storeEpisodic"),
      { userId, projectId, content, memoryType, importance, metadata }
    );
  }

  /**
   * Store or update a semantic memory.
   */
  async upsertSemanticMemory(
    userId: string,
    category: SemanticCategory,
    key: string,
    value: string,
    confidence: number,
    source: string
  ): Promise<Id<"semanticMemories">> {
    return await this.getClient().mutation(
      this.getApiRef("memories.upsertSemantic"),
      { userId, category, key, value, confidence, source }
    );
  }

  // ==========================================================================
  // INTERACTION PROCESSING
  // ==========================================================================

  /**
   * Process an interaction and extract/store relevant memories.
   */
  async processInteraction(
    userId: string,
    interaction: Interaction,
    projectId?: Id<"productProjects">
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

    // Extract and store patterns/preferences
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

  // ==========================================================================
  // HELPER METHODS
  // ==========================================================================

  /**
   * Extract relevant categories from a query for semantic memory lookup.
   */
  extractCategories(query: string): SemanticCategory[] {
    const categories: SemanticCategory[] = [];
    const lowerQuery = query.toLowerCase();

    if (/prefer|like|style|theme|mode|favorite/.test(lowerQuery)) {
      categories.push("preference");
    }
    if (/skill|know|experience|proficient|expert|can you/.test(lowerQuery)) {
      categories.push("skill");
    }
    if (/pattern|usually|always|tend to|typically/.test(lowerQuery)) {
      categories.push("pattern");
    }
    if (/fact|is|are|does|what|who|where/.test(lowerQuery)) {
      categories.push("fact");
    }

    // Default to common categories if none detected
    return categories.length > 0
      ? categories
      : ["preference", "skill", "pattern"];
  }

  /**
   * Build a context summary for prompt injection.
   */
  buildContextSummary(
    episodic: EpisodicMemory[],
    semantic: SemanticMemory[]
  ): string {
    const parts: string[] = [];

    // Add semantic memories (facts/preferences) - highest confidence first
    if (semantic.length > 0) {
      const semanticSummary = semantic
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 5)
        .map((m) => `- ${m.category}: ${m.value}`)
        .join("\n");
      parts.push(`User Context:\n${semanticSummary}`);
    }

    // Add recent relevant episodic memories - highest importance first
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

  /**
   * Calculate importance score for an interaction.
   */
  calculateImportance(interaction: Interaction): number {
    let score = 0.3; // Base importance

    // Positive feedback signals
    if (
      /thanks|perfect|great|exactly|awesome|excellent/i.test(
        interaction.userMessage
      )
    ) {
      score += 0.2;
    }

    // Multiple tools indicate complex interaction
    if (interaction.toolsUsed.length > 2) {
      score += 0.15;
    }

    // Decision-making language
    if (
      /decide|choose|prefer|want|let's|go with/i.test(interaction.userMessage)
    ) {
      score += 0.2;
    }

    // Creation operations are important
    if (interaction.toolsUsed.some((t) => /create|update|delete/.test(t))) {
      score += 0.15;
    }

    return Math.min(score, 1);
  }

  /**
   * Classify an interaction into a memory type.
   */
  classifyInteraction(interaction: Interaction): EpisodicMemoryType {
    const msg = interaction.userMessage.toLowerCase();

    // Check for feedback
    if (/thanks|great|perfect|awesome|excellent|love it/.test(msg)) {
      return "feedback";
    }

    // Check for preferences
    if (/prefer|like|want|rather|always use|my favorite/.test(msg)) {
      return "preference";
    }

    // Check for decisions
    if (/decide|choose|let's go with|use this|pick/.test(msg)) {
      return "decision";
    }

    // Check for milestones based on tools
    if (
      interaction.toolsUsed.some((t) =>
        /create_project|create_prd|shard_prd|launch/.test(t)
      )
    ) {
      return "milestone";
    }

    return "interaction";
  }

  /**
   * Summarize an interaction for storage.
   */
  summarizeInteraction(interaction: Interaction): string {
    // Truncate user message if too long
    const userPart =
      interaction.userMessage.length > 100
        ? interaction.userMessage.slice(0, 100) + "..."
        : interaction.userMessage;

    if (interaction.toolsUsed.length > 0) {
      return `User: "${userPart}" → Tools: ${interaction.toolsUsed.join(", ")}`;
    }
    return `User: "${userPart}"`;
  }

  /**
   * Extract patterns/preferences from an interaction.
   */
  extractPatterns(interaction: Interaction): ExtractedPattern[] {
    const patterns: ExtractedPattern[] = [];
    const msg = interaction.userMessage.toLowerCase();

    // Detect explicit preferences
    if (/i prefer|i like|i want|my favorite|i always use/.test(msg)) {
      patterns.push({
        category: "preference",
        key: `pref_${Date.now()}`,
        value: interaction.userMessage.slice(0, 200),
        confidence: 0.7,
      });
    }

    // Detect skill mentions
    if (/i know|i can|experience with|proficient in|expert at/.test(msg)) {
      patterns.push({
        category: "skill",
        key: `skill_${Date.now()}`,
        value: interaction.userMessage.slice(0, 200),
        confidence: 0.6,
      });
    }

    // Detect behavioral patterns
    if (/i usually|i always|i tend to|typically i/.test(msg)) {
      patterns.push({
        category: "pattern",
        key: `pattern_${Date.now()}`,
        value: interaction.userMessage.slice(0, 200),
        confidence: 0.5,
      });
    }

    return patterns;
  }

  // ==========================================================================
  // MEMORY MANAGEMENT
  // ==========================================================================

  /**
   * Delete an episodic memory.
   */
  async deleteEpisodicMemory(
    memoryId: Id<"episodicMemories">,
    userId: string
  ): Promise<void> {
    await this.getClient().mutation(
      this.getApiRef("memories.deleteEpisodic"),
      { memoryId, userId }
    );
  }

  /**
   * Delete a semantic memory.
   */
  async deleteSemanticMemory(
    memoryId: Id<"semanticMemories">,
    userId: string
  ): Promise<void> {
    await this.getClient().mutation(
      this.getApiRef("memories.deleteSemantic"),
      { memoryId, userId }
    );
  }

  /**
   * Get memory statistics for a user.
   */
  async getStats(userId: string) {
    return await this.getClient().query(
      this.getApiRef("memories.getMemoryStats"),
      { userId }
    );
  }
}

// Export singleton instance for convenience
let memoryManagerInstance: MemoryManager | null = null;

export function getMemoryManager(): MemoryManager {
  if (!memoryManagerInstance) {
    memoryManagerInstance = new MemoryManager();
  }
  return memoryManagerInstance;
}
