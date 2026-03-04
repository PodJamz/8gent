import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt, size = '1024x1024', quality = 'standard' } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: size,
        quality: quality,
      }),
    });

    if (!response.ok) {
      // Handle non-JSON error responses
      const contentType = response.headers.get('content-type');
      let errorMessage = 'Failed to generate image';

      if (contentType?.includes('application/json')) {
        try {
          const error = await response.json();
          errorMessage = error.error?.message || errorMessage;
        } catch {
          // JSON parse failed, use default message
        }
      } else {
        const text = await response.text();
        if (text) errorMessage = text;
      }

      console.error('Image generation API error:', errorMessage);
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    const data = await response.json();
    const imageData = data.data[0];

    return NextResponse.json({
      imageUrl: imageData?.url,
      revisedPrompt: imageData?.revised_prompt,
    });
  } catch (error) {
    console.error('Image generation API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
