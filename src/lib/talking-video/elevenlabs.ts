/**
 * ElevenLabs Voice Generation Service
 *
 * Uses the admin's cloned voice to generate audio from script text
 */

import type { ElevenLabsRequest, ElevenLabsResponse, ElevenLabsVoice } from './types';

const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

// The admin's cloned voice ID - set via env or use default
const DEFAULT_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || '';

export async function generateVoice(request: ElevenLabsRequest): Promise<ElevenLabsResponse> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    throw new Error('ELEVENLABS_API_KEY not configured');
  }

  const voiceId = request.voiceId || DEFAULT_VOICE_ID;
  if (!voiceId) {
    throw new Error('No voice ID provided and ELEVENLABS_VOICE_ID not configured');
  }

  const response = await fetch(
    `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text: request.text,
        model_id: request.modelId || 'eleven_multilingual_v2',
        voice_settings: {
          stability: request.stability ?? 0.5,
          similarity_boost: request.similarityBoost ?? 0.75,
          style: request.style ?? 0.5,
          use_speaker_boost: true,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ElevenLabs API error: ${error}`);
  }

  // Get audio as blob
  const audioBlob = await response.blob();

  // Calculate duration from audio (rough estimate: ~150 words per minute)
  const wordCount = request.text.split(/\s+/).length;
  const estimatedDuration = Math.ceil((wordCount / 150) * 60);

  // Convert to base64 data URL for client use
  const arrayBuffer = await audioBlob.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString('base64');
  const audioUrl = `data:audio/mpeg;base64,${base64}`;

  return {
    audioUrl,
    duration: estimatedDuration,
  };
}

export async function generateVoiceStream(
  request: ElevenLabsRequest
): Promise<ReadableStream<Uint8Array>> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    throw new Error('ELEVENLABS_API_KEY not configured');
  }

  const voiceId = request.voiceId || DEFAULT_VOICE_ID;

  const response = await fetch(
    `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}/stream`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text: request.text,
        model_id: request.modelId || 'eleven_multilingual_v2',
        voice_settings: {
          stability: request.stability ?? 0.5,
          similarity_boost: request.similarityBoost ?? 0.75,
          style: request.style ?? 0.5,
        },
      }),
    }
  );

  if (!response.ok || !response.body) {
    throw new Error('Failed to get voice stream');
  }

  return response.body;
}

export async function listVoices(): Promise<ElevenLabsVoice[]> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    throw new Error('ELEVENLABS_API_KEY not configured');
  }

  const response = await fetch(`${ELEVENLABS_API_URL}/voices`, {
    headers: {
      'xi-api-key': apiKey,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch voices');
  }

  const data = await response.json();
  return data.voices.map((v: Record<string, unknown>) => ({
    voice_id: v.voice_id,
    name: v.name,
    preview_url: v.preview_url,
    category: v.category,
  }));
}

export async function getVoice(voiceId: string): Promise<ElevenLabsVoice | null> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) return null;

  const response = await fetch(`${ELEVENLABS_API_URL}/voices/${voiceId}`, {
    headers: {
      'xi-api-key': apiKey,
    },
  });

  if (!response.ok) return null;

  const data = await response.json();
  return {
    voice_id: data.voice_id,
    name: data.name,
    preview_url: data.preview_url,
    category: data.category,
  };
}
