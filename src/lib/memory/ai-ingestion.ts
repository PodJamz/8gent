/**
 * AI-Powered Memory Ingestion
 *
 * Uses OpenAI (GPT-4o) to intelligently parse unstructured data and extract
 * structured memories (both episodic and semantic).
 *
 * @see docs/planning/recursive-memory-layer-scope.md
 */

import type { EpisodicMemoryType, SemanticCategory } from "./types";

/**
 * Extracted memory from AI processing
 */
export interface ExtractedEpisodicMemory {
  content: string;
  memoryType: EpisodicMemoryType;
  importance: number; // 0-1
  context?: string; // Additional context about why this is important
}

export interface ExtractedSemanticMemory {
  category: SemanticCategory;
  key: string; // Unique identifier like "preferred_language" or "favorite_color"
  value: string; // The actual value/fact
  confidence: number; // 0-1
  source?: string; // Where this was extracted from
}

export interface AIIngestionResult {
  episodicMemories: ExtractedEpisodicMemory[];
  semanticMemories: ExtractedSemanticMemory[];
  summary: string;
  processingNotes: string[];
}

/**
 * System prompt for memory extraction
 */
const EXTRACTION_SYSTEM_PROMPT = `You are a memory extraction AI for a personal knowledge system. Your job is to analyze text and extract two types of memories:

## EPISODIC MEMORIES (Events/Interactions)
These are specific events, decisions, conversations, or milestones. Each should have:
- content: A clear, standalone summary of what happened (50-200 chars)
- memoryType: One of "interaction", "decision", "preference", "feedback", "milestone"
- importance: 0.0-1.0 (higher = more significant)

Memory type guidelines:
- "interaction": General conversations or exchanges
- "decision": Choices made, directions taken, options selected
- "preference": Expressed likes, dislikes, preferences for how things should be
- "feedback": Reactions to work, opinions given, reviews
- "milestone": Achievements, completions, launches, significant events

## SEMANTIC MEMORIES (Facts/Knowledge)
These are learned facts, preferences, patterns, and skills. Each should have:
- category: One of "preference", "skill", "pattern", "fact"
- key: A unique snake_case identifier (e.g., "preferred_coding_language", "communication_style")
- value: The actual knowledge/fact (clear, specific)
- confidence: 0.0-1.0 (how certain is this information)

Category guidelines:
- "preference": Likes, dislikes, preferred ways of doing things
- "skill": Abilities, expertise, proficiency levels
- "pattern": Behavioral patterns, habits, tendencies
- "fact": Objective facts about the person (location, job, etc.)

## RULES
1. Extract MEANINGFUL memories only - skip trivial/obvious content
2. Be specific and actionable in your extractions
3. Deduplicate - don't extract the same fact multiple times
4. For semantic memories, use consistent key naming (snake_case, descriptive)
5. Higher importance/confidence for explicitly stated things vs inferred
6. Include context when it adds value

Respond with valid JSON only, no markdown formatting.`;

/**
 * Call OpenAI API directly
 */
async function callOpenAI(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY not configured");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      max_tokens: 4096,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

/**
 * Process content with AI and extract structured memories
 */
export async function extractMemoriesWithAI(
  content: string,
  filename: string,
  options: {
    maxEpisodic?: number;
    maxSemantic?: number;
  } = {}
): Promise<AIIngestionResult> {
  const { maxEpisodic = 50, maxSemantic = 30 } = options;

  // Truncate very long content to avoid token limits
  const truncatedContent =
    content.length > 50000
      ? content.slice(0, 50000) + "\n\n[Content truncated...]"
      : content;

  const userPrompt = `Analyze the following content from file "${filename}" and extract memories.

<content>
${truncatedContent}
</content>

Extract up to ${maxEpisodic} episodic memories and ${maxSemantic} semantic memories.

Respond with this exact JSON structure:
{
  "episodicMemories": [
    {
      "content": "string",
      "memoryType": "interaction|decision|preference|feedback|milestone",
      "importance": 0.0-1.0,
      "context": "optional string"
    }
  ],
  "semanticMemories": [
    {
      "category": "preference|skill|pattern|fact",
      "key": "snake_case_key",
      "value": "string",
      "confidence": 0.0-1.0,
      "source": "optional string"
    }
  ],
  "summary": "Brief summary of what was extracted",
  "processingNotes": ["Any notes about the extraction process"]
}`;

  try {
    const textContent = await callOpenAI(EXTRACTION_SYSTEM_PROMPT, userPrompt);

    if (!textContent) {
      throw new Error("No response from AI");
    }

    // Parse JSON response
    const result = JSON.parse(textContent) as AIIngestionResult;

    // Validate and sanitize the result
    return sanitizeIngestionResult(result, filename);
  } catch (error) {
    console.error("AI ingestion error:", error);

    // Return empty result on error
    return {
      episodicMemories: [],
      semanticMemories: [],
      summary: `Failed to process ${filename}`,
      processingNotes: [
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      ],
    };
  }
}

/**
 * Validate and sanitize AI extraction results
 */
function sanitizeIngestionResult(
  result: AIIngestionResult,
  filename: string
): AIIngestionResult {
  const validEpisodicTypes: EpisodicMemoryType[] = [
    "interaction",
    "decision",
    "preference",
    "feedback",
    "milestone",
  ];

  const validSemanticCategories: SemanticCategory[] = [
    "preference",
    "skill",
    "pattern",
    "fact",
  ];

  // Sanitize episodic memories
  const episodicMemories = (result.episodicMemories || [])
    .filter((m) => m && typeof m.content === "string" && m.content.length > 10)
    .map((m) => ({
      content: m.content.slice(0, 500), // Limit length
      memoryType: validEpisodicTypes.includes(m.memoryType)
        ? m.memoryType
        : "interaction",
      importance: Math.max(0, Math.min(1, Number(m.importance) || 0.5)),
      context: m.context ? String(m.context).slice(0, 200) : undefined,
    }));

  // Sanitize semantic memories
  const semanticMemories = (result.semanticMemories || [])
    .filter(
      (m) =>
        m &&
        typeof m.key === "string" &&
        m.key.length > 0 &&
        typeof m.value === "string" &&
        m.value.length > 0
    )
    .map((m) => ({
      category: validSemanticCategories.includes(m.category)
        ? m.category
        : "fact",
      key: m.key
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, "_")
        .slice(0, 50),
      value: m.value.slice(0, 500),
      confidence: Math.max(0, Math.min(1, Number(m.confidence) || 0.5)),
      source: m.source
        ? String(m.source).slice(0, 100)
        : `Extracted from ${filename}`,
    }));

  return {
    episodicMemories,
    semanticMemories,
    summary: result.summary || `Processed ${filename}`,
    processingNotes: Array.isArray(result.processingNotes)
      ? result.processingNotes.map((n) => String(n))
      : [],
  };
}

/**
 * Process multiple content chunks (for large files)
 */
export async function processLargeContent(
  content: string,
  filename: string,
  chunkSize: number = 30000
): Promise<AIIngestionResult> {
  // If content is small enough, process directly
  if (content.length <= chunkSize) {
    return extractMemoriesWithAI(content, filename);
  }

  // Split into chunks at paragraph boundaries
  const chunks: string[] = [];
  let currentChunk = "";

  const paragraphs = content.split(/\n\n+/);
  for (const para of paragraphs) {
    if (currentChunk.length + para.length > chunkSize) {
      if (currentChunk) {
        chunks.push(currentChunk);
      }
      currentChunk = para;
    } else {
      currentChunk += (currentChunk ? "\n\n" : "") + para;
    }
  }
  if (currentChunk) {
    chunks.push(currentChunk);
  }

  // Process each chunk
  const results: AIIngestionResult[] = [];
  for (let i = 0; i < chunks.length; i++) {
    const chunkFilename = `${filename} (part ${i + 1}/${chunks.length})`;
    const result = await extractMemoriesWithAI(chunks[i], chunkFilename);
    results.push(result);
  }

  // Merge results
  return mergeIngestionResults(results, filename);
}

/**
 * Merge multiple ingestion results
 */
function mergeIngestionResults(
  results: AIIngestionResult[],
  filename: string
): AIIngestionResult {
  const allEpisodic: ExtractedEpisodicMemory[] = [];
  const allSemantic: ExtractedSemanticMemory[] = [];
  const allNotes: string[] = [];

  for (const result of results) {
    allEpisodic.push(...result.episodicMemories);
    allSemantic.push(...result.semanticMemories);
    allNotes.push(...result.processingNotes);
  }

  // Deduplicate semantic memories by key (keep highest confidence)
  const semanticByKey = new Map<string, ExtractedSemanticMemory>();
  for (const mem of allSemantic) {
    const existing = semanticByKey.get(mem.key);
    if (!existing || mem.confidence > existing.confidence) {
      semanticByKey.set(mem.key, mem);
    }
  }

  return {
    episodicMemories: allEpisodic,
    semanticMemories: Array.from(semanticByKey.values()),
    summary: `Processed ${filename} in ${results.length} chunks`,
    processingNotes: allNotes,
  };
}
