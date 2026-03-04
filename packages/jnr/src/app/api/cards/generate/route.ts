import { NextRequest } from 'next/server';
import { CARD_GENERATION_SYSTEM_PROMPT, buildCardImagePrompt } from '@/lib/ai/prompts';

export const runtime = 'edge';

/**
 * Card Generation API for 8gent Jr
 *
 * Generates AAC card metadata via Claude and image via Fal.ai
 */

interface GenerateCardRequest {
  /** The word or concept for the card */
  word: string;
  /** Category for the card */
  category?: string;
  /** Optional style preference */
  style?: 'arasaac' | 'cartoon' | 'realistic' | 'simple';
}

interface GeneratedCard {
  id: string;
  label: string;
  speechText: string;
  categoryId: string;
  imageUrl: string;
  isGenerated: boolean;
  createdAt: string;
  tags: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateCardRequest = await request.json();

    if (!body.word || typeof body.word !== 'string') {
      return new Response(JSON.stringify({ error: 'Word is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const falKey = process.env.FAL_API_KEY;

    if (!anthropicKey) {
      return new Response(JSON.stringify({ error: 'Anthropic API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Step 1: Generate card metadata via Claude
    const metadataResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 512,
        system: CARD_GENERATION_SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: `Generate AAC card metadata for: "${body.word}"${body.category ? ` (category hint: ${body.category})` : ''}`,
          },
        ],
      }),
    });

    if (!metadataResponse.ok) {
      const error = await metadataResponse.text();
      console.error('Anthropic API error:', error);
      return new Response(JSON.stringify({ error: 'Failed to generate card metadata' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const metadataData = await metadataResponse.json();
    const metadataContent = metadataData.content?.[0]?.text;

    if (!metadataContent) {
      return new Response(JSON.stringify({ error: 'No metadata generated' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Parse metadata JSON
    let cardMetadata: {
      label: string;
      speechText: string;
      categoryId: string;
      imagePrompt: string;
      tags: string[];
    };

    try {
      let jsonStr = metadataContent;
      const jsonMatch = metadataContent.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        jsonStr = jsonMatch[1].trim();
      }
      cardMetadata = JSON.parse(jsonStr);
    } catch {
      // Fallback to basic metadata
      cardMetadata = {
        label: body.word,
        speechText: body.word,
        categoryId: body.category || 'custom',
        imagePrompt: buildCardImagePrompt(body.word, body.category || 'custom'),
        tags: [body.word.toLowerCase()],
      };
    }

    // Step 2: Generate image via Fal.ai (if API key is available)
    let imageUrl = '';

    if (falKey) {
      try {
        const imageResponse = await fetch('https://fal.run/fal-ai/flux/schnell', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Key ${falKey}`,
          },
          body: JSON.stringify({
            prompt: cardMetadata.imagePrompt,
            image_size: 'square',
            num_inference_steps: 4,
            num_images: 1,
            enable_safety_checker: true,
          }),
        });

        if (imageResponse.ok) {
          const imageData = await imageResponse.json();
          imageUrl = imageData.images?.[0]?.url || '';
        } else {
          console.error('Fal.ai error:', await imageResponse.text());
        }
      } catch (error) {
        console.error('Image generation error:', error);
      }
    }

    // If no image was generated, use a placeholder
    if (!imageUrl) {
      // Use a data URL placeholder with the first letter
      const letter = cardMetadata.label.charAt(0).toUpperCase();
      imageUrl = `data:image/svg+xml,${encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
          <rect width="200" height="200" fill="#f3f4f6"/>
          <text x="100" y="120" font-size="80" text-anchor="middle" fill="#9ca3af" font-family="sans-serif">${letter}</text>
        </svg>`
      )}`;
    }

    // Build the final card
    const card: GeneratedCard = {
      id: `gen-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      label: cardMetadata.label,
      speechText: cardMetadata.speechText,
      categoryId: cardMetadata.categoryId,
      imageUrl,
      isGenerated: true,
      createdAt: new Date().toISOString(),
      tags: cardMetadata.tags,
    };

    return new Response(JSON.stringify({ success: true, card }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Card generation error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
