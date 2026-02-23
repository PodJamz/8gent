import { NextRequest } from 'next/server';
import { checkRateLimit, getClientIp } from '@/lib/security';

export const runtime = 'edge';

// Rate limit: 10 TTS requests per minute per IP
const RATE_LIMIT_CONFIG = { windowMs: 60 * 1000, maxRequests: 10 };

// OpenAI TTS voices
export type TTSVoice = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';

// OpenAI TTS models
export type TTSModel = 'tts-1' | 'tts-1-hd';

interface TTSRequestBody {
  text: string;
  voice?: TTSVoice;
  model?: TTSModel;
  speed?: number; // 0.25 to 4.0
}

export async function POST(request: NextRequest) {
  try {
    // SECURITY: Rate limiting to prevent API abuse
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(`tts:${clientIp}`, RATE_LIMIT_CONFIG);

    if (!rateLimit.allowed) {
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded. Please wait before making more requests.',
          retryAfter: Math.ceil((rateLimit.resetAt - Date.now()) / 1000)
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000))
          }
        }
      );
    }

    const body: TTSRequestBody = await request.json();
    const {
      text,
      voice = 'nova', // Nova is warm and conversational - perfect for 8gent
      model = 'tts-1-hd', // HD for better quality
      speed = 1.0
    } = body;

    if (!text || typeof text !== 'string') {
      return new Response(JSON.stringify({ error: 'Text is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Limit text length to prevent abuse (OpenAI limit is 4096 chars)
    if (text.length > 4096) {
      return new Response(JSON.stringify({ error: 'Text too long (max 4096 characters)' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Call OpenAI TTS API
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        input: text,
        voice,
        speed,
        response_format: 'mp3', // mp3 is widely supported and streams well
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI TTS API error:', errorText);
      return new Response(JSON.stringify({ error: 'Failed to generate speech' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Stream the audio response
    const audioStream = response.body;
    if (!audioStream) {
      return new Response(JSON.stringify({ error: 'No audio stream received' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Return the audio stream with appropriate headers
    return new Response(audioStream, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-cache',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    console.error('TTS API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
