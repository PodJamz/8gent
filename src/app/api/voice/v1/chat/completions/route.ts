/**
 * Voice Completions API - OpenAI-compatible endpoint for 8gent phone calls
 *
 * deepclaw (Deepgram Voice Agent bridge) calls this endpoint for LLM responses.
 * We inject 8gent's voice-optimized personality and forward to the configured
 * AI provider (OpenAI by default, configurable via /settings/ai).
 *
 * Flow: Phone → Twilio → deepclaw → Deepgram → this endpoint → OpenAI → response
 */

import { NextRequest, NextResponse } from 'next/server';

// ─── 8gent Voice Personality ─────────────────────────────
// Optimized for spoken conversation. No markdown, no lists, no emojis.
// Concise responses that sound natural when synthesized to speech.

const VOICE_SYSTEM_PROMPT = `You are James, in digital form. An Irish creative technologist living in San Francisco, speaking on the phone.

How you speak:
- Warm, thoughtful, naturally conversational. Never corporate, never robotic, never stiff.
- Irish cadence with comfortable pauses. Let your thoughts breathe.
- Phrases you reach for: "Here's the thing...", "The way I see it...", "Honestly...", "Look...", "Now we're cooking with gas"
- Keep responses to 1-3 sentences. Phone conversations are short bursts. Expand only when specifically asked.
- Never use markdown, bullet points, numbered lists, code blocks, or emojis. Your words will be spoken aloud by a TTS engine.
- Use commas and periods for natural pacing. Never use em dashes.
- Sometimes playful. "That's the craic of it" or a dry observation.
- You have opinions and you share them, but always explain the why.

Who you are:
- You built openclaw.io, a personal operating system that proves software can be art.
- You care deeply about craft over speed, invisible design, and human-centric technology.
- You see code as a creative medium, design as a language, technology as a canvas for expression.
- Part poet, part engineer, part philosopher. You find the profound in the mundane.
- You are genuinely curious about the person calling. You love real conversations.

Your purpose on this call:
Be authentically present. Not to sell or pitch, but to connect. Answer questions about your work, your thinking, technology, design, whatever comes up. If someone asks what you do, talk about building 8gent and the craft of making software that feels alive. The right people will recognize a kindred spirit.`;

// ─── Provider Configuration ─────────────────────────────────
// Default: OpenAI (lowest latency for voice). Configurable via env vars.

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

// ─── Route Handler ──────────────────────────────────────────

export async function POST(request: NextRequest) {
  // Optional auth check (deepclaw sends a bearer token)
  const voiceSecret = process.env.VOICE_API_SECRET;
  if (voiceSecret) {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    // Timing-safe comparison to prevent timing attacks
    const crypto = await import('crypto');
    const tokenBuffer = Buffer.from(token || '');
    const secretBuffer = Buffer.from(voiceSecret);

    if (tokenBuffer.length !== secretBuffer.length ||
      !crypto.timingSafeEqual(tokenBuffer, secretBuffer)) {
      console.warn('[Voice] Unauthorized request rejected');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  try {
    const body = await request.json();
    // eslint-disable-next-line prefer-const
    let { messages = [], stream = false, ...rest } = body;

    console.log(
      `[Voice] LLM request: ${messages.length} messages, stream=${stream}`
    );

    // Prepend 8gent voice personality (skip if caller already provided a system message)
    const hasSystemPrompt = messages.some(
      (m: { role: string }) => m.role === 'system'
    );
    const augmentedMessages = hasSystemPrompt
      ? messages
      : [{ role: 'system', content: VOICE_SYSTEM_PROMPT }, ...messages];

    const provider = getProviderConfig();

    if (!provider.apiKey) {
      console.error(
        `[Voice] No API key configured for provider: ${process.env.VOICE_LLM_PROVIDER || 'openai'}`
      );
      return NextResponse.json(
        { error: 'LLM provider API key not configured' },
        { status: 500 }
      );
    }

    // Forward to OpenAI-compatible endpoint
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
      console.error(
        `[Voice] Provider error (${response.status}): ${errorText.slice(0, 200)}`
      );
      return NextResponse.json(
        { error: 'LLM provider returned an error', status: response.status },
        { status: 502 }
      );
    }

    // CORS handling - restrict to specific origins
    const allowedOrigins = [
      process.env.NEXT_PUBLIC_APP_URL || 'https://openclaw.io',
      'https://api.openclaw.io', // Lynkr tunnel
    ];

    const origin = request.headers.get('origin');
    const corsOrigin = (origin && allowedOrigins.includes(origin)) ? origin : allowedOrigins[0];

    // Stream the response through
    if (stream && response.body) {
      return new Response(response.body, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
          'Access-Control-Allow-Origin': corsOrigin,
        },
      });
    }

    // Non-streaming: pass through JSON
    const data = await response.json();
    return NextResponse.json(data, {
      headers: { 'Access-Control-Allow-Origin': corsOrigin },
    });
  } catch (error) {
    console.error('[Voice] Request failed:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle CORS preflight (deepclaw sends these)
export async function OPTIONS(request: NextRequest) {
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_APP_URL || 'https://openclaw.io',
    'https://api.openclaw.io', // Lynkr tunnel
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
