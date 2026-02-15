/**
 * Discovery Call Voice API
 *
 * OpenAI-compatible endpoint specifically for discovery calls.
 * Uses the discovery call system prompt with embedded elicitation techniques.
 *
 * Configure deepclaw to point to this endpoint for discovery calls.
 *
 * @see src/lib/claw-ai/discovery-call-prompt.ts
 * @see docs/planning/discovery-call-agent-architecture.md
 */

import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from '@/lib/convex-shim';
import { api } from '@/lib/convex-shim';
import { getDiscoveryPrompt, type DiscoveryTopic } from '@/lib/claw-ai/discovery-call-prompt';

// ─── Provider Configuration ─────────────────────────────────

function getProviderConfig() {
  const provider = process.env.VOICE_LLM_PROVIDER || 'openai';

  switch (provider) {
    case 'anthropic':
      return {
        url: 'https://api.anthropic.com/v1/messages',
        apiKey: process.env.ANTHROPIC_API_KEY || '',
        model: process.env.VOICE_LLM_MODEL || 'claude-haiku-4-5',
        format: 'anthropic' as const,
      };
    case 'lynkr':
      return {
        url: `${process.env.LYNKR_BASE_URL || 'http://localhost:8081'}/v1/chat/completions`,
        apiKey: process.env.LYNKR_API_KEY || '',
        model: process.env.VOICE_LLM_MODEL || 'gpt-oss:20b',
        format: 'openai' as const,
      };
    case 'openai':
    default:
      return {
        url: 'https://api.openai.com/v1/chat/completions',
        apiKey: process.env.OPENAI_API_KEY || '',
        model: process.env.VOICE_LLM_MODEL || 'gpt-4o-mini',
        format: 'openai' as const,
      };
  }
}

// ─── Session Management ─────────────────────────────────────

async function getOrCreateSession(callerId: string, convexUrl: string) {
  const client = new ConvexHttpClient(convexUrl);

  // Try to find existing active session
  const existingSession = await client.query(api.discovery.getSessionByCallerId, {
    callerId,
  });

  if (existingSession) {
    console.log(`[Discovery] Resuming session ${existingSession._id}`);
    return existingSession;
  }

  // Create new session
  const sessionId = await client.mutation(api.discovery.startSession, {
    callerId,
  });

  console.log(`[Discovery] Created new session ${sessionId}`);

  return { _id: sessionId, topicsCovered: [] as string[], phase: 'opening' as const };
}

async function addTranscriptEntry(
  sessionId: string,
  role: 'user' | 'assistant',
  content: string,
  convexUrl: string
) {
  const client = new ConvexHttpClient(convexUrl);

  await client.mutation(api.discovery.addTranscriptEntry, {
    sessionId: sessionId as any,
    role,
    content,
  });
}

// ─── Route Handler ──────────────────────────────────────────

export async function POST(request: NextRequest) {
  // Optional auth check
  const voiceSecret = process.env.VOICE_API_SECRET;
  if (voiceSecret) {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    const crypto = await import('crypto');
    const tokenBuffer = Buffer.from(token || '');
    const secretBuffer = Buffer.from(voiceSecret);

    if (tokenBuffer.length !== secretBuffer.length ||
        !crypto.timingSafeEqual(tokenBuffer, secretBuffer)) {
      console.warn('[Discovery] Unauthorized request rejected');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  try {
    const body = await request.json();
    const {
      messages = [],
      stream = false,
      caller_id: callerId = 'unknown',
      client_name: clientName,
      ...rest
    } = body;

    console.log(`[Discovery] Request: ${messages.length} messages, caller=${callerId}`);

    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
      throw new Error('NEXT_PUBLIC_CONVEX_URL not configured');
    }

    // Get or create session for this caller
    const session = await getOrCreateSession(callerId, convexUrl);

    // Log user message to transcript
    const lastUserMessage = [...messages].reverse().find((m: { role: string }) => m.role === 'user');
    if (lastUserMessage) {
      await addTranscriptEntry(
        session._id as string,
        'user',
        lastUserMessage.content,
        convexUrl
      );
    }

    // Build discovery prompt with context
    const discoveryPrompt = getDiscoveryPrompt({
      clientName,
      topicsCovered: session.topicsCovered as DiscoveryTopic[],
      phase: session.phase,
    });

    // Replace any existing system prompt with discovery prompt
    const filteredMessages = messages.filter((m: { role: string }) => m.role !== 'system');
    const augmentedMessages = [
      { role: 'system', content: discoveryPrompt },
      ...filteredMessages,
    ];

    const provider = getProviderConfig();

    if (!provider.apiKey) {
      console.error(`[Discovery] No API key for provider: ${process.env.VOICE_LLM_PROVIDER || 'openai'}`);
      return NextResponse.json(
        { error: 'LLM provider API key not configured' },
        { status: 500 }
      );
    }

    // Forward to LLM
    const response = await fetch(provider.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${provider.apiKey}`,
      },
      body: JSON.stringify({
        ...rest,
        model: provider.model,
        messages: augmentedMessages,
        stream,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Discovery] Provider error (${response.status}): ${errorText.slice(0, 200)}`);
      return NextResponse.json(
        { error: 'LLM provider returned an error', status: response.status },
        { status: 502 }
      );
    }

    // CORS
    const allowedOrigins = [
      process.env.NEXT_PUBLIC_APP_URL || 'https://openclaw.io',
      'https://api.openclaw.io',
    ];
    const origin = request.headers.get('origin');
    const corsOrigin = (origin && allowedOrigins.includes(origin)) ? origin : allowedOrigins[0];

    // Handle streaming response
    if (stream && response.body) {
      // For streaming, we can't easily capture the full response to log
      // This would require a TransformStream - keeping simple for now
      return new Response(response.body, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
          'Access-Control-Allow-Origin': corsOrigin,
        },
      });
    }

    // Non-streaming: capture response and log to transcript
    const data = await response.json();

    // Extract assistant response and log it
    const assistantContent = data.choices?.[0]?.message?.content;
    if (assistantContent) {
      await addTranscriptEntry(
        session._id as string,
        'assistant',
        assistantContent,
        convexUrl
      );
    }

    return NextResponse.json(data, {
      headers: { 'Access-Control-Allow-Origin': corsOrigin },
    });
  } catch (error) {
    console.error('[Discovery] Request failed:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// CORS preflight
export async function OPTIONS(request: NextRequest) {
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_APP_URL || 'https://openclaw.io',
    'https://api.openclaw.io',
  ];

  const origin = request.headers.get('origin');
  const corsOrigin = (origin && allowedOrigins.includes(origin)) ? origin : allowedOrigins[0];

  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': corsOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

/**
 * Health check / info endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'discovery-voice',
    description: 'Claw AI Discovery Call Voice API',
    usage: 'Configure deepclaw to use /api/voice/discovery for discovery calls',
  });
}
