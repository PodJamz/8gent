/**
 * Conversation Compaction API
 *
 * Compresses old messages into a summary while preserving key context.
 * Similar to Clawdbot's context compaction feature.
 *
 * POST /api/chat/compact
 * - Takes messages array and creates a compressed summary
 * - Returns summary for client to use in place of old messages
 */

import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "@/lib/openclaw/client";
import { api } from '@/lib/convex-shim';
import { checkRateLimit, getClientIp } from "@/lib/security";

// Rate limit: 5 compactions per minute per IP (expensive operation)
const RATE_LIMIT_CONFIG = { windowMs: 60 * 1000, maxRequests: 5 };

// =============================================================================
// Configuration
// =============================================================================

function getConvexClient() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_CONVEX_URL not configured");
  }
  return new ConvexHttpClient(url);
}

function getAnthropicApiKey(): string {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY not configured");
  }
  return apiKey;
}

interface AnthropicResponse {
  content: Array<{
    type: string;
    text?: string;
  }>;
}

// =============================================================================
// Types
// =============================================================================

interface CompactRequest {
  sessionId: string;
  userId?: string;
  messages: Array<{
    role: "user" | "assistant" | "system";
    content: string;
    timestamp?: number;
  }>;
  keepRecentCount?: number; // How many recent messages to keep (default: 10)
  instructions?: string; // Optional focus instructions
}

interface CompactResponse {
  success: boolean;
  compactionId?: string;
  summary?: string;
  keyPoints?: string[];
  decisions?: string[];
  openQuestions?: string[];
  topics?: string[];
  originalMessageCount?: number;
  tokensSaved?: number;
  error?: string;
}

// =============================================================================
// Compaction Prompt
// =============================================================================

const COMPACTION_SYSTEM_PROMPT = `You are a conversation summarizer. Your task is to compress a conversation into a concise summary that preserves all important context.

You will receive a conversation between a user and an AI assistant. Extract and organize the key information.

Respond with a JSON object in this exact format:
{
  "summary": "A 2-4 sentence summary of the overall conversation",
  "keyPoints": ["Array of important facts, information, or context established"],
  "decisions": ["Array of decisions that were made"],
  "openQuestions": ["Array of questions or tasks that are still pending"],
  "topics": ["Array of 3-5 main topics discussed"]
}

Guidelines:
- Focus on information that would be needed to continue the conversation
- Preserve specific details like names, numbers, technical terms
- Note any user preferences or requirements mentioned
- Keep the summary factual and neutral
- If code was discussed, note the key technical decisions but don't include full code
- Include any action items or next steps`;

// =============================================================================
// Handler
// =============================================================================

export async function POST(request: NextRequest): Promise<NextResponse<CompactResponse>> {
  try {
    // SECURITY: Rate limiting to prevent API abuse
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(`compact:${clientIp}`, RATE_LIMIT_CONFIG);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded. Please wait before making more requests.',
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000))
          }
        }
      );
    }

    const body: CompactRequest = await request.json();
    const { sessionId, userId, messages, keepRecentCount = 10, instructions } = body;

    // Validation
    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: "sessionId is required" },
        { status: 400 }
      );
    }

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { success: false, error: "messages array is required" },
        { status: 400 }
      );
    }

    // Don't compact if there aren't enough messages
    if (messages.length <= keepRecentCount) {
      return NextResponse.json(
        { success: false, error: "Not enough messages to compact" },
        { status: 400 }
      );
    }

    // Split messages: older ones to compact, recent ones to keep
    const messagesToCompact = messages.slice(0, -keepRecentCount);
    const originalMessageCount = messagesToCompact.length;

    // Format messages for Claude
    const conversationText = messagesToCompact
      .map((m) => {
        const role = m.role === "user" ? "User" : m.role === "assistant" ? "Assistant" : "System";
        return `${role}: ${m.content}`;
      })
      .join("\n\n");

    // Create the prompt
    let userPrompt = `Please summarize this conversation:\n\n${conversationText}`;
    if (instructions) {
      userPrompt += `\n\nAdditional focus instructions: ${instructions}`;
    }

    // Call Claude to generate summary
    const apiKey = getAnthropicApiKey();
    const claudeResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: COMPACTION_SYSTEM_PROMPT,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!claudeResponse.ok) {
      const errorText = await claudeResponse.text();
      throw new Error(`Claude API error: ${claudeResponse.status} - ${errorText}`);
    }

    const response: AnthropicResponse = await claudeResponse.json();

    // Parse the response
    const responseText =
      response.content[0]?.type === "text" ? response.content[0].text || "" : "";

    let compactionData: {
      summary: string;
      keyPoints: string[];
      decisions: string[];
      openQuestions: string[];
      topics: string[];
    };

    try {
      // Try to parse as JSON
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        compactionData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch {
      // Fallback if parsing fails
      compactionData = {
        summary: responseText.slice(0, 500),
        keyPoints: [],
        decisions: [],
        openQuestions: [],
        topics: [],
      };
    }

    // Calculate estimated tokens saved
    const originalTokens = Math.ceil(conversationText.length / 4); // Rough estimate
    const summaryTokens = Math.ceil(compactionData.summary.length / 4);
    const tokensSaved = Math.max(0, originalTokens - summaryTokens);

    // Get message timestamps
    const startTimestamp = messagesToCompact[0]?.timestamp || Date.now() - 3600000;
    const endTimestamp =
      messagesToCompact[messagesToCompact.length - 1]?.timestamp || Date.now();

    // Store the compaction in Convex
    const convex = getConvexClient();
    const result = await convex.mutation(api.compaction.createCompaction, {
      sessionId,
      userId,
      messageRange: {
        startIndex: 0,
        endIndex: originalMessageCount - 1,
        startTimestamp,
        endTimestamp,
      },
      originalMessageCount,
      summary: compactionData.summary,
      keyPoints: compactionData.keyPoints,
      decisions: compactionData.decisions,
      openQuestions: compactionData.openQuestions,
      topics: compactionData.topics,
      tokensSaved,
    });

    return NextResponse.json({
      success: true,
      compactionId: result.compactionId,
      summary: compactionData.summary,
      keyPoints: compactionData.keyPoints,
      decisions: compactionData.decisions,
      openQuestions: compactionData.openQuestions,
      topics: compactionData.topics,
      originalMessageCount,
      tokensSaved,
    });
  } catch (error) {
    console.error("Compaction error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Compaction failed",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/chat/compact?sessionId=xxx
 * Retrieve existing compactions for a session
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { error: "sessionId query parameter required" },
        { status: 400 }
      );
    }

    const convex = getConvexClient();
    const compactions = await convex.query(api.compaction.getSessionCompactions, {
      sessionId,
    });

    return NextResponse.json({
      success: true,
      compactions,
    });
  } catch (error) {
    console.error("Get compactions error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to get compactions",
      },
      { status: 500 }
    );
  }
}
