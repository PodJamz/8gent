import { NextRequest, NextResponse } from 'next/server';

/**
 * ElevenLabs Voice Cloning API Route
 *
 * POST /api/voice/create
 * Body: FormData with audio file and voice name
 * Returns: { voiceId: string, name: string }
 */

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

export async function POST(request: NextRequest) {
  try {
    if (!ELEVENLABS_API_KEY) {
      return NextResponse.json(
        { error: 'ElevenLabs not configured' },
        { status: 503 }
      );
    }

    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string | null;

    if (!audioFile || !name) {
      return NextResponse.json(
        { error: 'Missing audio file or name' },
        { status: 400 }
      );
    }

    // Create FormData for ElevenLabs
    const elevenLabsFormData = new FormData();
    elevenLabsFormData.append('name', name);
    elevenLabsFormData.append('description', description || `Voice created for ${name} via 8gent`);
    elevenLabsFormData.append('files', audioFile);
    elevenLabsFormData.append('labels', JSON.stringify({ source: '8gent-app' }));

    // Call ElevenLabs Voice Cloning API
    const response = await fetch('https://api.elevenlabs.io/v1/voices/add', {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: elevenLabsFormData,
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('ElevenLabs voice creation error:', error);
      return NextResponse.json(
        { error: 'Voice creation failed', details: error },
        { status: 500 }
      );
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      voiceId: result.voice_id,
      name: name,
    });
  } catch (error) {
    console.error('Voice creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
